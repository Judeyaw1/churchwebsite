import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ExternalLink, Play } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
}

interface LiveStream {
  id: string;
  title: string;
  url: string;
  schedule: string;
  isLive: boolean;
}

export default function Media() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, streamsRes] = await Promise.all([
          fetch("/api/gallery"),
          fetch("/api/live-streams"),
        ]);

        if (galleryRes.ok) {
          setGalleryImages(await galleryRes.json());
        }
        if (streamsRes.ok) {
          setLiveStreams(await streamsRes.json());
        }
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentLive = liveStreams.find((s) => s.isLive) || liveStreams[0];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              Gallery & Live Stream
            </h1>
            <p className="text-white/70 max-w-3xl mx-auto">
              Browse all photos and watch our live or past streams.
            </p>
          </motion.div>

          {/* Live Stream Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-white" />
                <h2 className="text-2xl font-semibold text-white">Live Stream</h2>
              </div>
              {currentLive?.url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => window.open(currentLive.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch
                </Button>
              )}
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-0">
                {currentLive ? (
                  <div className="aspect-video bg-black flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block animate-pulse">
                        {currentLive.isLive ? "LIVE" : "Stream"}
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {currentLive.title}
                      </h3>
                      <p className="text-white/70">{currentLive.schedule}</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                    <p className="text-white/70">No live stream available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gallery Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-white" />
                <h2 className="text-2xl font-semibold text-white">Photo Gallery</h2>
              </div>
              <span className="text-sm text-white/60">
                {galleryImages.length} photos
              </span>
            </div>

            {isLoading ? (
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="bg-white/5 border-white/10 overflow-hidden">
                    <div className="aspect-[4/3] bg-black/30 flex items-center justify-center p-2 overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Failed to load gallery image:', image.url, image.title);
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          // Show placeholder
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="flex flex-col items-center justify-center h-full text-white/50">
                                <svg class="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p class="text-xs">Image unavailable</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-white font-semibold text-sm mb-1">{image.title}</h3>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>{image.date}</span>
                        <span>{image.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-white/70 mx-auto mb-3" />
                  <p className="text-white/70">No gallery images yet</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
