import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Sparkles, HeartHandshake, BookOpen, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import photo1 from '@assets/womensfelloship/DSC_5232.JPG';
import photo2 from '@assets/womensfelloship/DSC_5249.JPG';
import photo3 from '@assets/womensfelloship/DSC_5250.JPG';
import photo4 from '@assets/womensfelloship/DSC_5253.JPG';
import photo5 from '@assets/womensfelloship/DSC_5271.JPG';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: photo1,
    title: '',
    description: '',
  },
  {
    id: 2,
    image: photo2,
    title: '',
    description: '',
  },
  {
    id: 3,
    image: photo3,
    title: '',
    description: '',
  },
  {
    id: 4,
    image: photo4,
    title: '',
    description: '',
  },
  {
    id: 5,
    image: photo5,
    title: '',
    description: '',
  },
];

export default function WomensFellowship() {
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-24 pb-16 bg-gradient-to-b from-black/95 via-black/90 to-black/85">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-left"
          >
            <p className="text-white/70 uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
              United Bethel Presbyterian Church
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              Women&apos;s Fellowship
            </h1>
            <p className="text-lg sm:text-xl text-white/85 max-w-3xl leading-relaxed">
              A sisterhood dedicated to love, unity, and lives that reflect Christ wherever we are.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-black/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Our Aim</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              The Aim of the United Bethel Presbyterian Church&apos;s Women&apos;s Fellowship is to help the
              women in UBPC Church lead exemplary lives as Christian women in love and unity, so that
              wherever they may be - at home, in the church, or any public place - their behavior and
              actions are exemplary and attract other women to Christ.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Scripture Focus</h2>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">
              Matthew 5:16 says, &quot;In the same way, let your light shine before others, so that they
              may see your good works and give glory to your Father who is in heaven.&quot;
            </p>
            <p className="text-white/70 leading-relaxed">
              This is a call to live a life of integrity and good deeds that are visible, not for
              self-glory, but so that others are led to praise and glorify God.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-black/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10 rounded-2xl p-6 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl sm:text-3xl font-serif text-white">Let Your Light Shine</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Live with Integrity</h3>
                <p className="text-white/75">
                  Let your light shine through sincerity, diligence, and a commitment to truth and
                  good character.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Practice Good Works</h3>
                <p className="text-white/75">
                  Good works flow from faith and are seen in love, service, and unity within our
                  families and community.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Give God the Glory</h3>
                <p className="text-white/75">
                  The purpose of shining is not self-glorification, but to lead others to praise our
                  Father in heaven.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-black/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-white">Moments of Fellowship</h2>
          </motion.div>

          <div className="relative w-full h-[520px] sm:h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-white/10">
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
              Join the Women&apos;s Fellowship
            </h2>
            <p className="text-white/80 mb-6">
              We welcome every woman to grow in faith, love, and community. Let&apos;s shine together.
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

      <Footer />
    </div>
  );
}
