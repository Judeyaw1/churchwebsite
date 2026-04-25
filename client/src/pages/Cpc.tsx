import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicPageLayout from '@/components/PublicPageLayout';
import PublicPageHero from '@/components/PublicPageHero';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sparkles,
  HeartHandshake,
  BookOpen,
  ClipboardCheck,
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

interface AttendanceRow {
  childName: string;
  guardianName: string;
  time: string;
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

const slides: Slide[] = slideImages.slice(0, 5).map((image, index) => ({
  id: index + 1,
  image,
  title: '',
  description: '',
}));

const cpcTeacherApprovers = [
  'Patience Harris',
  'Beryl Lartey',
  'Georgina Fosua',
  'Hazel Frempong',
  'Dr. Akua Ohene',
  'Afia-Grace Harris',
  'Pearl Mensah',
  'Constance Beneman',
];

export default function Cpc() {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1200 : window.innerWidth
  );
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [signInForm, setSignInForm] = useState<AttendanceRow>({
    childName: '',
    guardianName: '',
    time: getCurrentTime(),
  });
  const [signOutForm, setSignOutForm] = useState<AttendanceRow>({
    childName: '',
    guardianName: '',
    time: getCurrentTime(),
  });
  const [signOutTeacherApprovedBy, setSignOutTeacherApprovedBy] = useState('');
  const [cpcHoneypot, setCpcHoneypot] = useState('');
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState('');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideSpacing = Math.min(360, Math.max(150, viewportWidth * (isMobile ? 0.45 : 0.3)));
  const slideCardWidth = Math.min(420, Math.max(210, viewportWidth * (isMobile ? 0.62 : 0.35)));
  const slideCardHeight = Math.min(520, Math.max(280, viewportWidth * (isMobile ? 0.95 : 0.48)));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const submitAttendance = async (
    form: AttendanceRow,
    action: 'check-in' | 'check-out',
    teacherApprovedBy: string | null,
    reset: () => void
  ) => {
    if (action === 'check-out' && !teacherApprovedBy) {
      setAttendanceMessage('Please select the teacher who approved this sign-out.');
      return;
    }

    setIsSavingAttendance(true);
    setAttendanceMessage('');
    try {
      const response = await fetch('/api/cpc-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: attendanceDate,
          honeypot: cpcHoneypot,
          entries: [
            {
              childName: form.childName,
              guardianName: form.guardianName || 'N/A',
              checkIn: action === 'check-in' ? form.time : '',
              checkOut: action === 'check-out' ? form.time : '',
              teacherApprovedBy: action === 'check-out' ? teacherApprovedBy : null,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.message || 'Failed to save attendance';
        if (errorMessage.includes('Cannot check out before check in')) {
          window.alert(errorMessage);
        }
        throw new Error(errorMessage);
      }

      setAttendanceMessage('Attendance saved.');
      reset();
    } catch (error) {
      console.error('Failed to save attendance:', error);
      setAttendanceMessage(
        error instanceof Error ? error.message : 'Failed to save attendance.'
      );
    } finally {
      setIsSavingAttendance(false);
    }
  };

  return (
    <PublicPageLayout className="overflow-x-hidden">
      <PublicPageHero
        title="Cool Presbyterian Class (CPC)"
        description="A Christ-centered learning environment for children ages 4–11, nurturing Christian values and helping them grow in faith in Jesus."
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
              <HeartHandshake className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Name</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              <span className="font-semibold text-white">CPC</span> stands for{' '}
              <span className="font-semibold text-white">Cool Presbyterian Class</span>.
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
              Call: <span className="font-semibold text-white">“CPC - WW”</span>
              <br />
              Response: <span className="font-semibold text-white">“JD”</span>
              <br />
              Call: What does that mean?
              <br />
              Response:{' '}
              <span className="font-semibold text-white">“What Will Jesus Do”</span>
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
            className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10 rounded-2xl p-6 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl sm:text-3xl font-serif text-white">
                Vision & Core Values
              </h2>
            </div>
            <p className="text-white/80 leading-relaxed mb-6">
              Proverbs 22:6: “Train up a child in the way he should go, and when he is old, he will
              not depart from it.”
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Vision</h3>
                <p className="text-white/75">
                  Helping children learn God’s Word and grow strong in Jesus.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">God’s Word First</h3>
                <p className="text-white/75">
                  We love the Bible and learn from it every day.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Growing in Jesus</h3>
                <p className="text-white/75">
                  We plant seeds of faith that help children walk with Jesus for life with happy
                  and willing hearts.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Safe & Caring Community</h3>
                <p className="text-white/75">
                  We create a place where every child feels loved, welcomed, and valued.
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
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <ClipboardCheck className="h-6 w-6 text-white" />
              <h2 className="text-2xl sm:text-3xl font-serif text-white">
                Kids Check-In & Pick-Up
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Kids Check-In</h3>
                <p className="text-white/75 leading-relaxed">
                  A parent or guardian signs each child in before class starts. Every child gets
                  a name tag so our team can care for them well.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Kid Pick-Up</h3>
                <p className="text-white/75 leading-relaxed">
                  Only a parent or approved guardian can pick up a child. Please return to the
                  CPC area after service to sign out your child.
                </p>
              </div>
            </div>
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
            className="rounded-2xl p-4 sm:p-6 bg-black/95 border border-white/10"
          >
            <div className="bg-white border border-purple-200 rounded-2xl p-5 sm:p-6 mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif text-gray-900">
                CPC Weekly Attendance Form: Sign-in/out
              </h2>
              <p className="text-gray-700 mt-4 leading-relaxed">
                For the safety of our children, UBPC requires weekly attendance sign-in/sign-out.
                Please sign your child in upon arrival and out at pick-up. If you are signing in
                multiple children, submit a separate response for each child after pressing Submit.
              </p>
            </div>
            <div className="hidden" aria-hidden="true">
              <label className="text-gray-700 text-sm">
                Leave this field empty
                <input
                  type="text"
                  value={cpcHoneypot}
                  onChange={(event) => setCpcHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="bg-white border border-purple-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">SIGN-IN</h3>
                  <p className="text-gray-700 mt-1">Kindly sign your child in to class</p>
                </div>
                <label className="text-gray-700 text-sm block">
                  Today&apos;s Date
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(event) => setAttendanceDate(event.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  If child&apos;s name is not listed, please enter full name here
                  <input
                    type="text"
                    value={signInForm.childName}
                    onChange={(event) =>
                      setSignInForm((prev) => ({ ...prev, childName: event.target.value }))
                    }
                    placeholder="Name of child"
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  Parent/Guardian Name
                  <input
                    type="text"
                    value={signInForm.guardianName}
                    onChange={(event) =>
                      setSignInForm((prev) => ({ ...prev, guardianName: event.target.value }))
                    }
                    placeholder="Name of parent/guardian"
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  Time
                  <input
                    type="time"
                    value={signInForm.time}
                    onChange={(event) =>
                      setSignInForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    submitAttendance(signInForm, 'check-in', null, () =>
                      setSignInForm({
                        childName: '',
                        guardianName: '',
                        time: getCurrentTime(),
                      })
                    )
                  }
                  disabled={isSavingAttendance}
                  className="inline-flex items-center justify-center rounded-lg bg-[#000000] text-white px-5 py-2 text-sm font-semibold hover:bg-[#5d3db3] transition-colors disabled:opacity-60"
                >
                  {isSavingAttendance ? 'Saving...' : 'Submit Sign-In'}
                </button>
              </div>

              <div className="bg-white border border-purple-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">SIGN OUT</h3>
                  <p className="text-gray-700 mt-1">Kindly sign your child out of class</p>
                </div>
                <label className="text-gray-700 text-sm block">
                  Today&apos;s Date
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(event) => setAttendanceDate(event.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  If child&apos;s name is not listed, please enter full name here
                  <input
                    type="text"
                    value={signOutForm.childName}
                    onChange={(event) =>
                      setSignOutForm((prev) => ({ ...prev, childName: event.target.value }))
                    }
                    placeholder="Name of child"
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  Parent/Guardian Name
                  <input
                    type="text"
                    value={signOutForm.guardianName}
                    onChange={(event) =>
                      setSignOutForm((prev) => ({ ...prev, guardianName: event.target.value }))
                    }
                    placeholder="Name of parent/guardian"
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  Time
                  <input
                    type="time"
                    value={signOutForm.time}
                    onChange={(event) =>
                      setSignOutForm((prev) => ({ ...prev, time: event.target.value }))
                    }
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </label>
                <label className="text-gray-700 text-sm block">
                  Teacher Who Approved Sign-Out
                  <select
                    value={signOutTeacherApprovedBy}
                    onChange={(event) => setSignOutTeacherApprovedBy(event.target.value)}
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
                  >
                    <option value="">Select a teacher</option>
                    {cpcTeacherApprovers.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    submitAttendance(signOutForm, 'check-out', signOutTeacherApprovedBy, () => {
                      setSignOutForm({
                        childName: '',
                        guardianName: '',
                        time: getCurrentTime(),
                      });
                      setSignOutTeacherApprovedBy('');
                    })
                  }
                  disabled={isSavingAttendance}
                  className="inline-flex items-center justify-center rounded-lg bg-white text-[#000000] border border-[#6d48c7] px-5 py-2 text-sm font-semibold hover:bg-[#efe9ff] transition-colors disabled:opacity-60"
                >
                  {isSavingAttendance ? 'Saving...' : 'Submit Sign-Out'}
                </button>
              </div>
            </div>

            {attendanceMessage ? (
              <p className="text-gray-700 text-sm mt-2">{attendanceMessage}</p>
            ) : null}
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
            <h2 className="text-2xl sm:text-3xl font-serif text-white">See Photos</h2>
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

                  const x = offset * slideSpacing;
                  const rotateY = offset * (isMobile ? -28 : -45);
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
                      <div
                        className="relative rounded-3xl overflow-hidden shadow-2xl"
                        style={{ width: `${slideCardWidth}px`, height: `${slideCardHeight}px` }}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title || 'CPC moments'}
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
                              {isActive && slide.description && (
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

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
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
              Join UBPC Children Service
            </h2>
            <p className="text-white/80 mb-6">
              We are excited to welcome every child into a loving, Christ-centered community.
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
