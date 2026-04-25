import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import heroVideoMp4 from '@assets/generated_images/UBPC.mp4';
import heroVideoMov from '@assets/generated_images/UBPC.MOV';
import { fetchWithCache } from '@/lib/fetchWithCache';

interface HeroSectionProps {
  className?: string;
}

interface WeeklyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

const experienceCards = [
  {
    icon: Clock,
    eyebrow: 'Gathering',
    title: 'Sunday Services',
    detail: 'Sundays 10:00 AM',
  },
  {
    icon: MapPin,
    eyebrow: 'Devotion',
    title: 'Virtual Prayer Rhythm',
    detail: 'Morning devotion Mon - Fri 5:00 AM & Evening devotion Mon - Thurs 8:00 PM',
  },
  {
    icon: Calendar,
    eyebrow: 'Prayer',
    title: 'Friday Meeting',
    detail: 'Prayer Meeting every Friday at 8:00 PM',
  },
];

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyEvent[]>([]);
  const [weeklyEventsLoading, setWeeklyEventsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleGetInTouch = () => {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.location.href = '/#contact';
  };

  useEffect(() => {
    let isActive = true;

    const fetchWeeklyEvents = async () => {
      try {
        const eventsData = await fetchWithCache<WeeklyEvent[]>('/api/events', {
          ttl: 1000 * 60,
        });

        if (isActive) {
          setWeeklyEvents(eventsData);
        }
      } catch (error) {
        console.error('Failed to fetch weekly events:', error);
      } finally {
        if (isActive) {
          setWeeklyEventsLoading(false);
        }
      }
    };

    fetchWeeklyEvents();

    return () => {
      isActive = false;
    };
  }, []);

  const eventsThisWeek = useMemo(() => {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    return weeklyEvents
      .map((event) => {
        const dateTime = new Date(`${event.date} ${event.time}`);
        return Number.isNaN(dateTime.getTime()) ? null : { ...event, dateTime };
      })
      .filter((event): event is WeeklyEvent & { dateTime: Date } => {
        if (!event) return false;
        return event.dateTime >= now && event.dateTime <= endOfWeek;
      })
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 3);
  }, [weeklyEvents]);

  const weeklyEventLines = eventsThisWeek.map((event) => {
    const day = event.dateTime.toLocaleDateString('en-US', { weekday: 'long' });
    return `${day} • ${event.title} • ${event.time}`;
  });

  return (
    <section className={`relative overflow-hidden pt-24 sm:pt-28 ${className}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <video
          ref={videoRef}
          className="h-full w-full object-cover opacity-50"
          muted={isMuted}
          loop
          playsInline
          autoPlay
          onError={() => console.log('Video failed to load')}
        >
          <source src={heroVideoMp4} type="video/mp4" />
          <source src={heroVideoMov} type="video/quicktime" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_32%),linear-gradient(180deg,rgba(4,4,4,0.74)_0%,rgba(9,9,9,0.56)_38%,rgba(5,5,5,0.88)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="grid gap-10 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm uppercase tracking-[0.28em] text-white/75 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-white/80" />
              <a
                href="https://maps.google.com/?q=9045+Maier+Road+Suite+D,+Laurel,+MD+20723"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                Laurel, Maryland
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2 }}
            >
              <h1 className="max-w-4xl font-serif text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              United Bethel Presbyterian Church
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                United Bethel Presbyterian Church welcomes families, seekers, and lifelong believers
                into a rhythm of faithful teaching, daily devotion, and Christ-centered fellowship.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.35 }}
              className="mt-8 flex flex-col gap-4 md:flex-row"
            >
              <Button
                size="lg"
                className="group h-13 rounded-full bg-white px-7 text-base font-semibold text-black hover:bg-white/90"
                data-testid="button-plan-visit"
                onClick={handleGetInTouch}
              >
                Plan Your Visit
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 rounded-full border-white/25 bg-black/25 px-7 text-base font-semibold text-white hover:bg-white/10"
                data-testid="button-watch-online"
                onClick={() => window.open('http://www.youtube.com/@ubpcmedia6480', '_blank')}
              >
                Watch Online
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.45 }}
              className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {experienceCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.75rem] border border-white/12 bg-white/[0.06] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">{card.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/72">{card.detail}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="xl:justify-self-end"
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-[#0e0e0e]/90 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-white/45">This Week</p>
                  <h2 className="mt-2 font-serif text-3xl text-white">Worship Rhythm</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={togglePlayPause}
                    className="rounded-full border border-white/15 bg-white/5 p-3 text-white transition hover:bg-white/10"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="rounded-full border border-white/15 bg-white/5 p-3 text-white transition hover:bg-white/10"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 text-white">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-[0.22em]">Weekly Gatherings</span>
                </div>
                <div className="mt-4 space-y-3">
                  {weeklyEventsLoading ? (
                    <p className="text-white/65">Loading weekly activities...</p>
                  ) : weeklyEventLines.length > 0 ? (
                    weeklyEventLines.map((line) => (
                      <div
                        key={line}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/85"
                      >
                        {line}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/85">
                        Rhema Hour Wednesday 10 AM
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/85">
                        Lunch With God Friday 12 PM
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white p-5 text-black">
                  <p className="text-xs uppercase tracking-[0.24em] text-black/55">In Person</p>
                  <p className="mt-3 text-2xl font-semibold">9045 Maier Rd</p>
                  <p className="mt-2 text-sm leading-6 text-black/75">Suite D, Laurel, MD 20723</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">Daily Prayer</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Morning & Evening</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    A house of devotion all week long, online and together.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
