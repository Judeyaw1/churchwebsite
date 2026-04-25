import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicPageLayout from '@/components/PublicPageLayout';
import PublicPageHero from '@/components/PublicPageHero';
import {
  BookOpen,
  HeartHandshake,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import slide1 from '@assets/generated_images/image1.JPG';
import slide2 from '@assets/generated_images/image8.JPG';
import slide3 from '@assets/generated_images/image9.JPG';
import slide4 from '@assets/generated_images/image10.JPG';
import slide5 from '@assets/generated_images/image13.JPG';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  { id: 1, image: slide1, title: 'We Believe', description: 'Rooted in Scripture and the Holy Trinity.' },
  { id: 2, image: slide2, title: 'We Are Called', description: 'Sharing the Gospel with love and conviction.' },
  { id: 3, image: slide3, title: 'We Are Committed', description: 'Training and nurturing youth for service.' },
  { id: 4, image: slide4, title: 'We Pursue Peace', description: 'Living in unity and compassion.' },
  { id: 5, image: slide5, title: 'Growing Together', description: 'Spiritual maturity and leadership.' },
];

const executives = [
  'President: Fayanne Abankwah',
  'Vice President: Richmond Osei',
  'Secretary: Leslie Frimpong',
  'Treasurer: Natalie Frimpong',
  'Women’s Organizer: Jessica Osei',
  'Men’s Organizer: Seyram Ameevor',
  'Chaplain: Nana Kwame',
];

export default function YpgFellowship() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <PublicPageLayout>
      <PublicPageHero
        title="Young People's Guild (YPG)"
        description="Youth mission and values shaped around Scripture, discipleship, and peace."
      />

      <section className="py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Our Believe</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              We affirm the Holy Bible as the final authority in all matters of faith, life, and
              conduct. We profess our faith in the Holy Trinity — God the Father, Son, and Holy
              Spirit.
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
              <HeartHandshake className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">We Are Called</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              We embrace the commission of our Lord and Savior Jesus Christ to go into the world and
              make disciples of all nations, sharing the Gospel with love, purpose, and conviction.
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
            className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10 rounded-2xl p-6 sm:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">We Are Committed</h3>
                <p className="text-white/75">
                  We dedicate ourselves to uniting, encouraging, training, and nurturing the youth
                  to grow in their relationship with Jesus Christ and cultivate spiritual maturity,
                  character, leadership, and a life of service.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">We Pursue Peace</h3>
                <p className="text-white/75">
                  We commit to living in harmony with God, one another, and within ourselves,
                  seeking peace, compassion, and unity as we reflect the love of Christ in our daily
                  lives.
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
            <h2 className="text-2xl sm:text-3xl font-serif text-white">YPG Moments</h2>
            <p className="text-white/70 mt-2">Replace these images with YPG photos if needed.</p>
          </motion.div>

          <div className="relative w-full h-[520px] sm:h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
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
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
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

      <section className="py-16 sm:py-20 bg-black/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Membership</h2>
            </div>
            <p className="text-white/80 mb-4">
              <span className="font-semibold">Junior Youth Membership (Ages 12–17)</span>
              <br />
              Open to all young people ages 12–17 who are registered members of United Bethel
              Presbyterian Church in any congregation.
            </p>
            <p className="text-white/80">
              <span className="font-semibold">Young People’s Guild – YPG (Ages 17–25)</span>
              <br />
              Open to individuals ages 17–25 committed to active participation in the ministry and
              growth of the church.
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
              <Shield className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Membership Dues</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Members of the Young People’s Guild are required to pay membership dues as determined
              periodically by the Branch Guild Executive. These dues support ministry programs,
              activities, and the ongoing work of the Guild.
            </p>
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
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Current Executives</h2>
            </div>
            <ul className="text-white/80 space-y-2">
              {executives.map((exec) => (
                <li key={exec}>{exec}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

    </PublicPageLayout>
  );
}
