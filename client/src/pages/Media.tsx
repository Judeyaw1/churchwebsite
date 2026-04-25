import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PublicPageLayout from "@/components/PublicPageLayout";
import PublicPageHero from "@/components/PublicPageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ExternalLink, Play, ChevronDown } from "lucide-react";
import { fetchWithCache } from "@/lib/fetchWithCache";

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
  const [openGalleryCategory, setOpenGalleryCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryData, streamData] = await Promise.all([
          fetchWithCache<GalleryImage[]>("/api/gallery", { ttl: 1000 * 60 * 2 }),
          fetchWithCache<LiveStream[]>("/api/live-streams", { ttl: 1000 * 60 }),
        ]);
        setGalleryImages(galleryData);
        setLiveStreams(streamData);
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentLive = liveStreams.find((s) => s.isLive) || liveStreams[0];
  const groupedGalleryImages = galleryImages.reduce((acc, image) => {
    const rawCategory = image.category?.trim();
    const category = rawCategory && rawCategory.length > 0 ? rawCategory : "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(image);
    return acc;
  }, {} as Record<string, GalleryImage[]>);

  const orderedGalleryCategories = Object.keys(groupedGalleryImages).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    if (!openGalleryCategory && orderedGalleryCategories.length > 0) {
      setOpenGalleryCategory(orderedGalleryCategories[0]);
    }
  }, [orderedGalleryCategories, openGalleryCategory]);

  return (
    <PublicPageLayout>
      <PublicPageHero
        title="Gallery & Live Stream"
        description="Browse church photos and watch our live or past streams in a layout that matches the new homepage."
        align="center"
      />

        <section className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
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

            <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,0,0,0.32)]">
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
                  <div className="aspect-video bg-[linear-gradient(135deg,#1a1a1a,#0f0f0f)] flex items-center justify-center">
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
              <div className="mb-6 aspect-[4/3] bg-[linear-gradient(135deg,#1a1a1a,#0f0f0f)] flex items-center justify-center rounded-[2rem] border border-white/10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : galleryImages.length > 0 ? (
              <div className="space-y-6">
                {orderedGalleryCategories.map((category) => {
                  const isOpen = openGalleryCategory === category;
                  return (
                    <div key={category} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => setOpenGalleryCategory(isOpen ? null : category)}
                        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left text-white"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                          <span className="text-lg font-semibold">{category}</span>
                        </div>
                        <span className="text-sm text-white/60">
                          {groupedGalleryImages[category].length} photo{groupedGalleryImages[category].length === 1 ? "" : "s"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {groupedGalleryImages[category].map((image) => (
                            <Card key={image.id} className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.04]">
                              <div className="aspect-[4/3] bg-black/30 flex items-center justify-center p-2 overflow-hidden">
                                <img
                                  src={image.url}
                                  alt={image.title}
                                  className="w-full h-full object-cover rounded"
                                  loading="lazy"
                                  decoding="async"
                                  onError={(e) => {
                                    console.error('Failed to load gallery image:', image.url, image.title);
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
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
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[linear-gradient(135deg,#1a1a1a,#0f0f0f)] flex items-center justify-center rounded-[2rem] border border-white/10">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-white/70 mx-auto mb-3" />
                  <p className="text-white/70">No gallery images yet</p>
                </div>
              </div>
            )}
          </div>
        </section>
    </PublicPageLayout>
  );
}
