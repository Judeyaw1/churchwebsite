import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Sparkles,
  HeartHandshake,
  BookOpen,
  Users,
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from 'lucide-react';
import slide1 from '@assets/generated_images/image8.JPG';
import slide2 from '@assets/generated_images/image9.JPG';
import slide3 from '@assets/generated_images/image10.JPG';
import slide4 from '@assets/generated_images/image11.JPG';
import slide5 from '@assets/generated_images/image12.JPG';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: slide1,
    title: 'Faithful Community',
    description: 'Young adults growing together in Christ.',
  },
  {
    id: 2,
    image: slide2,
    title: 'Worship & Service',
    description: 'Serving with joy in church life and outreach.',
  },
  {
    id: 3,
    image: slide3,
    title: 'Discipleship',
    description: 'Rooted in the Reformed tradition.',
  },
  {
    id: 4,
    image: slide4,
    title: 'Leadership Growth',
    description: 'Equipping leaders for the future of the church.',
  },
  {
    id: 5,
    image: slide5,
    title: 'Fellowship in Christ',
    description: 'Building strong, lasting bonds of faith.',
  },
];

const executives = [
  'Bro Daniel Agyekum - President',
  'Bro Benjamin Boamah - Vice President',
  'Sis Lordina Asante - Secretary',
  'Sis Portia Osei - Women’s Organizer',
  'Sis Doris Boamah - Deputy Women’s Organizer',
  'Bro Kwesi Amoanu Ephraim - Men’s Organizer',
  'Elder Gilbert Okyere - Deputy Men’s Organizer',
  'Bro Agyemang Amprofi - Chaplain',
  'Sis Beryl Boakye - Deputy Chaplain',
];

const activities = [
  'Morning and evening devotions',
  'Bible readings for Sunday services',
  'Liturgy and Friday evening services',
  'Church picnics and birthday programs',
  'Weddings, funeral celebrations, and Christmas extravaganza',
];

export default function YafFellowship() {
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
              YAF (Young Adult Fellowship)
            </h1>
            <p className="text-lg sm:text-xl text-white/85 max-w-3xl leading-relaxed">
              YAF stands for Young Adult Fellowship. We are a community of young adults committed
              to faith, fellowship, and leadership in the church.
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
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Brief History</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              The inception of UBPC YAF came during the formation of United Bethel Presbyterian
              Church, when young men and women recognized the importance of forming this group to
              serve as the mainstay of our young church during its first Sunday worship service.
              UBPC YAF was inaugurated in 2017 by the YAF National Council led by Mr. Ralph
              Agyemang. With God’s help, determination, perseverance, commitment, and a dedicated
              Pastor as our Patron, YAF has survived and grown to about seventy members.
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
              <h2 className="text-2xl font-serif text-white">Motto</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              “Remember your creator in the days of thy youth, before the days of trouble come and
              the years approach when you will say, I find no pleasure in them” – Ecclesiastes 12:1
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
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <HeartHandshake className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Mission</h3>
                </div>
                <p className="text-white/75">
                  Increase the spiritual and numerical growth of our members.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Vision</h3>
                </div>
                <p className="text-white/75">
                  Promote the teachings of the church in the Reformed tradition and address the
                  spiritual, economic, physical, and social needs of young adults.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-white" />
                  <h3 className="text-white font-semibold">Target Audience</h3>
                </div>
                <p className="text-white/75">
                  Christians ages 25–45 who believe in our Lord and Savior Jesus Christ.
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
            <h2 className="text-2xl sm:text-3xl font-serif text-white">YAF Moments</h2>
            <p className="text-white/70 mt-2">
              Replace these images with YAF photos if needed.
            </p>
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
              <h2 className="text-2xl font-serif text-white">Current Executives</h2>
            </div>
            <ul className="space-y-2 text-white/80">
              {executives.map((exec) => (
                <li key={exec}>{exec}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Meeting Days</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              YAF meets once every month on the last Saturday of the month at the church premises
              from 6:00 PM – 8:00 PM, and sometimes via virtual conference when there is a crashed
              church program.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-black/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">YAF Activities</h2>
            </div>
            <ul className="space-y-2 text-white/80">
              {activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Goals</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Our goals are to fulfill the Great Commission by making disciples of all nations and
              to encourage, educate, and admonish young adults to have a closer and constant
              relationship with our Lord and Savior Jesus Christ—fellowshipping in Him and living
              at peace with ourselves and others.
            </p>
          </motion.div>
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
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4">YAF Greetings</h2>
            <p className="text-white/80 mb-6">
              YAF: <span className="font-semibold">Fellowship in Christ</span>
            </p>
            <p className="text-white/70 max-w-3xl mx-auto">
              Special thanks to our former Presidents and executives, especially Elder Francisca
              Tachie Nsiah and Sister Herrienta Obaa Yaa Asabea (1st & 2nd YAF Presidents) for their
              stirring performance and commitment. Final thanks to our Minister in charge, Rt Rev
              Mark Asiedu Frimpong, for his immense and unwavering support. YAF is grateful—God bless
              you for everything. Shalom.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
