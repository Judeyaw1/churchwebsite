import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Play, Camera, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchWithCache } from '@/lib/fetchWithCache';

interface LiveStream {
  id: string;
  title: string;
  url: string;
  schedule: string;
  isLive: boolean;
}

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
}

interface LiveStreamGallerySectionProps {
  className?: string;
}

export default function LiveStreamGallerySection({ className = '' }: LiveStreamGallerySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Fetch live streams and gallery data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streamsData, galleryData] = await Promise.all([
          fetchWithCache<LiveStream[]>('/api/live-streams', { ttl: 1000 * 60 }),
          fetchWithCache<GalleryImage[]>('/api/gallery', { ttl: 1000 * 60 * 2 }),
        ]);

        setLiveStreams(streamsData);
        console.log('Gallery data fetched:', galleryData.length, 'images');
        console.log('First gallery image URL:', galleryData[0]?.url);
        setGalleryImages(galleryData);
      } catch (error) {
        console.error('Failed to fetch live streams and gallery data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert YouTube URL to embed format
  const convertYouTubeUrl = (url: string) => {
    try {
      // If already in embed format, return as is
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      
      // Handle youtu.be short URLs
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      
      // Handle youtube.com/watch?v= format
      if (url.includes('youtube.com/watch?v=') || url.includes('youtube.com/')) {
        let videoId = '';
        if (url.includes('v=')) {
          videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('/')) {
          videoId = url.split('/').pop()?.split('?')[0] || '';
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      
      // If URL doesn't match any pattern, try to extract video ID from the end
      const possibleVideoId = url.split('/').pop()?.split('?')[0];
      if (possibleVideoId && possibleVideoId.length > 8) {
        return `https://www.youtube.com/embed/${possibleVideoId}?autoplay=1`;
      }
      
      return url;
    } catch (error) {
      console.error('Error converting YouTube URL:', error);
      return url;
    }
  };

  // Get current live stream
  const currentLiveStream = liveStreams.find(stream => stream.isLive) || liveStreams[0];

  // Debug logging
  useEffect(() => {
    if (currentLiveStream) {
      console.log('Current Live Stream:', {
        title: currentLiveStream.title,
        url: currentLiveStream.url,
        isLive: currentLiveStream.isLive,
        convertedUrl: currentLiveStream.url ? convertYouTubeUrl(currentLiveStream.url) : 'No URL'
      });
    } else {
      console.log('No live stream found');
    }
  }, [currentLiveStream]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  // Keep selected thumbnail in view (works for arrows and clicks)
  useEffect(() => {
    const el = thumbRefs.current[currentImageIndex];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentImageIndex]);

  return (
    <section ref={ref} className={`py-20 bg-black/95 ${className}`} id="gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 sm:mb-6">
            Live Stream & <span className="text-white">Gallery</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join our live worship services online and explore our photo gallery showcasing 
            the life and community of our church family.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Live Stream Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/20 overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white/70">Loading live stream...</p>
                    </div>
                  </div>
                ) : currentLiveStream ? (
                  <div className="relative aspect-video bg-black">
                    {currentLiveStream.url ? (
                      <iframe
                        key={currentLiveStream.id}
                        src={convertYouTubeUrl(currentLiveStream.url)}
                        title={currentLiveStream.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        frameBorder="0"
                      />
                    ) : (
                      <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-primary/50">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block animate-pulse">
                              LIVE
                            </div>
                            <Play className="h-16 w-16 text-white/80 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">{currentLiveStream.title}</h3>
                            <p className="text-white/70">{currentLiveStream.schedule || 'Live Stream'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-video bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-white/80 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Live Stream</h3>
                      <p className="text-white/70">Check back later for live services</p>
                    </div>
                  </div>
                )}

                {!isLoading && currentLiveStream && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{currentLiveStream.title}</h3>
                      {currentLiveStream.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/30 text-white hover:bg-white/10"
                          onClick={() => window.open(currentLiveStream.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch Live
                        </Button>
                      )}
                    </div>
                    
                    {currentLiveStream.schedule && (
                      <div className="flex items-center text-white/80">
                        <Play className="h-4 w-4 mr-2" />
                        <span className="text-sm">{currentLiveStream.schedule}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Visit Our Channel Button */}
            <div className="text-left mt-6">
              <Button
                variant="outline"
                size="lg"
                className="border-white/70 text-white hover:bg-white/10 hover:text-white px-8 py-3"
                onClick={() => window.open('http://www.youtube.com/@ubpcmedia6480', '_blank')}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Visit Our Channel
              </Button>
            </div>
          </motion.div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white/5 border-white/20 overflow-hidden">
              <CardContent className="p-0">
                {/* Gallery Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Camera className="h-5 w-5 text-white mr-2" />
                      <h3 className="text-xl font-semibold text-white">Photo Gallery</h3>
                    </div>
                    <a
                      href="/#gallery"
                      className="inline-flex items-center px-3 py-2 border border-white/30 text-white rounded-md hover:bg-white/10 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View All
                    </a>
                  </div>
                </div>

                {/* Gallery Carousel */}
                <div className="relative">
                  {isLoading ? (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white/70">Loading gallery...</p>
                      </div>
                    </div>
                  ) : galleryImages.length > 0 ? (
                    <>
                      <div className="aspect-[4/3] bg-black/30 flex items-center justify-center p-3 relative transition-all duration-300 overflow-hidden">
                        <img
                          src={galleryImages[currentImageIndex].url}
                          alt={galleryImages[currentImageIndex].title}
                          className="w-full h-full object-cover rounded-lg"
                          decoding="async"
                          onLoad={() => {
                            console.log('Gallery image loaded:', galleryImages[currentImageIndex].url);
                          }}
                          onError={(e) => {
                            console.error('Gallery image failed to load:', galleryImages[currentImageIndex].url);
                            console.error('Attempted URL:', e.currentTarget.src);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        
                        {/* Image Info Overlay */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <h4 className="font-semibold text-lg">{galleryImages[currentImageIndex].title}</h4>
                          <p className="text-sm opacity-90">{galleryImages[currentImageIndex].date}</p>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300"
                        >
                          <ChevronLeft className="h-5 w-5 text-black" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300"
                        >
                          <ChevronRight className="h-5 w-5 text-black" />
                        </button>
                      </div>

                      {/* Gallery Thumbnails */}
                      <div className="p-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {galleryImages.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setCurrentImageIndex(index)}
                              ref={(el) => (thumbRefs.current[index] = el)}
                              className={`min-w-[110px] max-w-[140px] aspect-[4/3] overflow-hidden rounded-lg bg-black/30 flex items-center justify-center p-1 transition-all duration-300 ${
                                index === currentImageIndex 
                                  ? 'ring-2 ring-white/50 scale-105' 
                                  : 'hover:scale-105 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-full object-cover rounded"
                                decoding="async"
                                onLoad={() => {
                                  console.log('Gallery thumbnail loaded:', image.url);
                                }}
                                onError={(e) => {
                                  console.error('Gallery thumbnail failed to load:', image.url);
                                  console.error('Attempted URL:', e.currentTarget.src);
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-white/80 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Gallery Images</h3>
                        <p className="text-white/70">Images will appear here once uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
