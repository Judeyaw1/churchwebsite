import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicPageLayout from '@/components/PublicPageLayout';
import PublicPageHero from '@/components/PublicPageHero';
import {
  Sparkles,
  Target,
  Lightbulb,
  Heart,
  Users,
  Book,
  Globe,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import fallbackImage from '@assets/generated_images/image1.JPG';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const imageModules = import.meta.glob<{ default: string }>(
  '@assets/generated_images/image*.JPG',
  { eager: true }
);

const sortedImages = Object.entries(imageModules)
  .map(([path, mod]) => {
    const match = path.match(/image(\d+)\.JPG$/i);
    if (!match) return null;
    return { index: Number(match[1]), src: mod.default };
  })
  .filter((entry): entry is { index: number; src: string } => entry !== null)
  .sort((a, b) => a.index - b.index)
  .map((entry) => entry.src);

const slideImages = sortedImages.length > 0 ? sortedImages : [fallbackImage];

const slides: Slide[] = slideImages.slice(0, 5).map((image, index) => {
  const titles = [
    'Worship Together',
    'Faith in Community',
    'Serving with Love',
    'Growing in Christ',
    'Welcoming All',
  ];
  const descriptions = [
    'Gathering each week to worship and pray as one church family.',
    'Building relationships that strengthen our walk with Christ.',
    'Living out the gospel through service and compassion.',
    'Encouraging spiritual growth through discipleship.',
    'A home where every person is known and cared for.',
  ];

  return {
    id: index + 1,
    image,
    title: titles[index % titles.length],
    description: descriptions[index % descriptions.length],
  };
});

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <PublicPageLayout>
      <PublicPageHero
        title="About Our Church"
        description="Discover the story, mission, and community behind United Bethel Presbyterian."
      />

      <section className="py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Our Mission</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              To glorify God by making disciples of Jesus Christ through worship, fellowship,
              discipleship, ministry, and evangelism. We seek to be a beacon of hope and faith in
              our community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Our Vision</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              To be a thriving Presbyterian community where all people can grow in faith, serve
              others, and experience the transforming love of Christ in everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.3)] sm:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl sm:text-3xl font-serif text-white">Our Core Values</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-[1.25rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Faith & Worship</h3>
                </div>
                <p className="text-white/75">
                  We gather to worship God with reverence, prayer, and gratitude.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Fellowship</h3>
                </div>
                <p className="text-white/75">
                  We build relationships that strengthen our church family.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Scripture</h3>
                </div>
                <p className="text-white/75">
                  We are grounded in the Word to guide our daily lives.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-black/35 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Service</h3>
                </div>
                <p className="text-white/75">
                  We serve our neighbors with compassion and humility.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-white">Moments of Community</h2>
          </motion.div>

          <div className="relative h-[520px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#111,#050505)] shadow-[0_40px_120px_rgba(0,0,0,0.32)] sm:h-[600px]">
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {slides.map((slide, index) => {
                  const offset = index - currentIndex;
                  const isActive = offset === 0;
                  const absOffset = Math.abs(offset);

                  const x = offset * 360;
                  const rotateY = offset * -45;
                  const z = isActive ? 200 : -absOffset * 180;
                  const scale = isActive ? 1.05 : 0.8;
                  const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.25;

                  return (
                    <motion.div
                      key={slide.id}
                      className="absolute cursor-pointer"
                      initial={false}
                      animate={{ x, rotateY, z, scale, opacity }}
                      transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      onClick={() => !isActive && goToSlide(index)}
                    >
                      <div className="relative w-[320px] sm:w-[420px] h-[420px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
                            transition={{ duration: 0.4 }}
                          >
                            <h3 className="text-white text-xl font-serif font-semibold mb-2">
                              {slide.title}
                            </h3>
                            <AnimatePresence>
                              {isActive && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-white/85 text-sm"
                                >
                                  {slide.description}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-5 right-5 w-3 h-3 bg-white rounded-full shadow-lg"
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-5 right-5 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="absolute top-5 left-5 z-20 bg-white/10 backdrop-blur-lg text-white px-4 py-2 rounded-full border border-white/20 text-sm">
              <span className="opacity-70">Slide</span> {currentIndex + 1} / {slides.length}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-500 rounded-full border border-white/30 backdrop-blur-sm ${
                    index === currentIndex
                      ? 'bg-white w-12 h-3 shadow-lg shadow-white/40'
                      : 'bg-white/20 hover:bg-white/40 w-3 h-3'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-black/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4">
              Join Our Church Family
            </h2>
            <p className="text-white/80 mb-6">
              We would love to worship and grow with you. Come as you are.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg bg-white text-black px-6 py-3 font-semibold hover:bg-black/90 hover:text-white transition-colors"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>

    </PublicPageLayout>
  );
}
