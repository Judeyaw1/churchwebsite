import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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
  action: 'check-in' | 'check-out';
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

export default function Cpc() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([
    { childName: '', guardianName: '', action: 'check-in', time: getCurrentTime() },
  ]);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState('');

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

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(`/api/cpc-attendance?date=${attendanceDate}`);
        if (!response.ok) throw new Error('Failed to load attendance');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const rows = data.map((entry: any) => {
            const hasCheckIn = Boolean(entry.checkIn);
            const hasCheckOut = Boolean(entry.checkOut);
            return {
              childName: entry.childName || '',
              guardianName: entry.guardianName || '',
              action: hasCheckOut ? 'check-out' : 'check-in',
              time: hasCheckOut ? entry.checkOut : entry.checkIn || getCurrentTime(),
            } as AttendanceRow;
          });
          setAttendanceRows(rows);
        } else {
          setAttendanceRows([
            { childName: '', guardianName: '', action: 'check-in', time: getCurrentTime() },
          ]);
        }
      } catch (error) {
        console.error('Failed to load CPC attendance:', error);
      }
    };

    fetchAttendance();
  }, [attendanceDate]);

  const updateAttendanceRow = (
    index: number,
    field: keyof AttendanceRow,
    value: string | boolean,
  ) => {
    setAttendanceRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addAttendanceRow = () => {
    setAttendanceRows((prev) => [
      ...prev,
      { childName: '', guardianName: '', action: 'check-in', time: getCurrentTime() },
    ]);
  };

  const removeAttendanceRow = (index: number) => {
    setAttendanceRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
  };

  const saveAttendance = async () => {
    const token = localStorage.getItem('adminToken') || '';
    if (!token) {
      setAttendanceMessage('Admin login required to save attendance.');
      return;
    }

    setIsSavingAttendance(true);
    setAttendanceMessage('');
    try {
      const response = await fetch('/api/cpc-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: attendanceDate,
          entries: attendanceRows.map((row) => ({
            childName: row.childName,
            guardianName: row.guardianName || 'N/A',
            checkIn: row.action === 'check-in' ? row.time : '',
            checkOut: row.action === 'check-out' ? row.time : '',
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save attendance');
      }

      setAttendanceMessage('Attendance saved.');
    } catch (error) {
      console.error('Failed to save attendance:', error);
      setAttendanceMessage('Failed to save attendance.');
    } finally {
      setIsSavingAttendance(false);
    }
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
              Cool Presbyterian Class (CPC)
            </h1>
            <p className="text-lg sm:text-xl text-white/85 max-w-3xl leading-relaxed">
              UBPC CPC Sunday School is a Christ-centered learning environment for children ages
              4–11, nurturing Christian values and helping them grow in faith in Jesus.
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
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="text-white/70 uppercase tracking-[0.2em] text-xs sm:text-sm">
                  CPC Weekly Attendance
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif text-white mt-2">
                  Sign-In / Sign-Out
                </h2>
              </div>
              <label className="text-white/70 text-sm">
                Attendance Date
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(event) => setAttendanceDate(event.target.value)}
                  className="mt-2 block w-full sm:w-auto bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
              </label>
            </div>

            <div className="space-y-5">
              {attendanceRows.map((row, index) => (
                <div
                  key={`${row.childName}-${index}`}
                  className="rounded-2xl border border-white/10 bg-black/40 p-5 sm:p-6"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="text-white/70 text-sm">
                      Child Name
                      <input
                        type="text"
                        value={row.childName}
                        onChange={(event) =>
                          updateAttendanceRow(index, 'childName', event.target.value)
                        }
                        placeholder="Full name"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-white/70 text-sm">
                      Parent/Guardian
                      <input
                        type="text"
                        value={row.guardianName}
                        onChange={(event) =>
                          updateAttendanceRow(index, 'guardianName', event.target.value)
                        }
                        placeholder="Full name"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      />
                    </label>
                    <label className="text-white/70 text-sm">
                      Action
                      <select
                        value={row.action}
                        onChange={(event) =>
                          updateAttendanceRow(
                            index,
                            'action',
                            event.target.value as AttendanceRow['action']
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      >
                        <option value="check-in">Check In</option>
                        <option value="check-out">Check Out</option>
                      </select>
                    </label>
                    <label className="text-white/70 text-sm">
                      Time
                      <input
                        type="time"
                        value={row.time}
                        onChange={(event) => updateAttendanceRow(index, 'time', event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                      />
                    </label>
                    <div className="flex items-end justify-end md:col-span-2">
                      <button
                        type="button"
                        onClick={() => removeAttendanceRow(index)}
                        className="text-white/70 hover:text-white text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={addAttendanceRow}
                className="inline-flex items-center justify-center rounded-lg bg-white/10 text-white px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                Add Child
              </button>
              <button
                type="button"
                onClick={saveAttendance}
                disabled={isSavingAttendance}
                className="inline-flex items-center justify-center rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-black/90 hover:text-white transition-colors disabled:opacity-60"
              >
                {isSavingAttendance ? 'Saving...' : 'Submit Attendance'}
              </button>
            </div>

            {attendanceMessage ? (
              <p className="text-white/80 text-sm mt-2">{attendanceMessage}</p>
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

      <Footer />
    </div>
  );
}
