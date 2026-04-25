import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [weeklyEvents, setWeeklyEvents] = useState<WeeklyEvent[]>([]);
  const [weeklyEventsLoading, setWeeklyEventsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
        return Number.isNaN(dateTime.getTime())
          ? null
          : { ...event, dateTime };
      })
      .filter((event): event is WeeklyEvent & { dateTime: Date } => {
        if (!event) return false;
        return event.dateTime >= now && event.dateTime <= endOfWeek;
      })
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .slice(0, 2);
  }, [weeklyEvents]);

  const weeklyEventLines = eventsThisWeek.map((event) => {
    const day = event.dateTime.toLocaleDateString('en-US', { weekday: 'short' });
    return `${day} ${event.title} ${event.time}`;
  });

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-contain sm:object-cover bg-black"
          muted={isMuted}
          loop
          playsInline
          autoPlay
          onError={() => {
            console.log('Video failed to load');
          }}
        >
          <source src={heroVideoMp4} type="video/mp4" />
          <source src={heroVideoMov} type="video/quicktime" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      {/* Video Controls - Bottom Center */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={togglePlayPause}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 rounded-full p-2 sm:p-3 border border-white/20"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          ) : (
            <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 rounded-full p-2 sm:p-3 border border-white/20"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left text-white pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-left">
            Welcome to{' '}
            <span className="text-white">United Bethel 
              <br className="hidden sm:block" /> Presbyterian Church</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 max-w-3xl leading-relaxed text-left">
            A place where faith meets community, and hearts find home. 
            Join us for worship, fellowship, and spiritual growth.
          </p>
        </motion.div>

        {/* Service Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center mb-3">
              <Clock className="h-6 w-6 text-white mr-2" />
              <span className="font-semibold">Service Times</span>
            </div>
            <p className="text-white/90">
              Sundays 10:00 AM
              Monday - Thurday 8:00 PM
              Friday 8:00 PM
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center mb-3">
              <MapPin className="h-6 w-6 text-white mr-2" />
              <span className="font-semibold">Location</span>
            </div>
            <p className="text-white/90">
              <a href="https://maps.google.com/?q=9045+Maier+Road,+Laurel,+MD+20723">9045 Maier Rd<br /> Suite D, Laurel, MD 20723</a>
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center mb-3">
              <Calendar className="h-6 w-6 text-white mr-2" />
              <span className="font-semibold">This Week</span>
            </div>
            <p className="text-white/90">
              {weeklyEventsLoading
                ? 'Loading weekly activities...'
                : weeklyEventLines.length > 0
                  ? weeklyEventLines.map((line, index) => (
                      <span key={line}>
                        {line}
                        {index < weeklyEventLines.length - 1 ? <br /> : null}
                      </span>
                    ))
                  : (
                      <>
                        Wed Bible Study 7:00 PM<br />Fri Youth Group 6:30 PM
                      </>
                    )}
            </p>
          </div>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start items-start"
        >
          <Button
            size="lg"
            className="bg-white hover:bg-black/90 hover:text-white text-black font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            data-testid="button-plan-visit"
            onClick={handleGetInTouch}
          >
            Get In Touch
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-md border-black/30 text-white hover:bg-black/20 font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            data-testid="button-watch-online"
            onClick={() => window.open('http://www.youtube.com/@ubpcmedia6480', '_blank')}
          >
            Watch Online
          </Button>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex gap-3 sm:gap-4 mt-4 sm:mt-6"
        >
          <a
            href="https://facebook.com/unitedbethelpresbyterian"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            aria-label="Follow us on Facebook"
          >
            <svg className="w-6 h-6 text-white group-hover:text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          
          <a
            href="https://instagram.com/unitedbethelpresbyterian"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            aria-label="Follow us on Instagram"
          >
            <svg className="w-6 h-6 text-white group-hover:text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          
          <a
            href="https://www.tiktok.com/@ubpc_md_usa?_r=1&_t=ZP-92PhPbkitVX"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            aria-label="Follow us on TikTok"
          >
            <svg className="w-6 h-6 text-white group-hover:text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-1.843 4.793 4.793 0 0 1-1.03-2.993h-3.6v13.354a3.022 3.022 0 1 1-2.996-3.023c.275 0 .546.037.807.107V9.47a6.608 6.608 0 0 0-.807-.05C5.033 9.42 2.4 12.06 2.4 15.23c0 3.17 2.633 5.79 5.793 5.79a5.793 5.793 0 0 0 5.793-5.79V9.868a8.39 8.39 0 0 0 4.32 1.2V7.5a4.793 4.793 0 0 1-2.717-.814z"/>
            </svg>
          </a>
          
          <a
            href="http://www.youtube.com/@ubpcmedia6480"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
            aria-label="Subscribe to our YouTube channel"
          >
            <svg className="w-6 h-6 text-white group-hover:text-white/90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="hidden sm:block absolute bottom-24 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
