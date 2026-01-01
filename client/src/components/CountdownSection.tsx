import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import EventCountdown from '@/components/EventCountdown';
import { fetchWithCache } from '@/lib/fetchWithCache';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  registrationRequired: boolean;
  image?: string;
}

interface CountdownSectionProps {
  className?: string;
}

export default function CountdownSection({ className = '' }: CountdownSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newYearTimeLeft, setNewYearTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const confettiPieces = Array.from({ length: 24 }, (_, index) => index);

  // Jan 1, 2026 00:00 America/New_York = 2026-01-01T05:00:00Z (EST is UTC-5).
  const NEW_YEAR_TARGET_UTC = Date.UTC(2026, 0, 1, 5, 0, 0);
  const shouldShowNewYear = Date.now() < NEW_YEAR_TARGET_UTC;

  useEffect(() => {
    if (shouldShowNewYear) {
      setIsLoading(false);
      return;
    }
    const fetchEvents = async () => {
      try {
        const eventsData = await fetchWithCache<Event[]>('/api/events', {
          ttl: 1000 * 60,
        });
        console.log('CountdownSection: Fetched events:', eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('CountdownSection: Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [shouldShowNewYear]);

  useEffect(() => {
    if (!shouldShowNewYear) return;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = NEW_YEAR_TARGET_UTC - now;
      if (diff <= 0) {
        setNewYearTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setNewYearTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [shouldShowNewYear, NEW_YEAR_TARGET_UTC]);

  if (shouldShowNewYear) {
    return (
      <section ref={ref} className={`py-16 bg-gradient-to-b from-black/95 to-black/90 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              New Year <span className="text-white">Countdown</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Ring in the new year with us. Countdown to Jan 1, 2026 (America/New_York).
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black/70 via-black/60 to-black/80 p-8 sm:p-12"
          >
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-20 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 overflow-hidden">
                {confettiPieces.map((piece) => (
                  <motion.span
                    key={piece}
                    className="absolute h-2.5 w-2.5 rounded-sm bg-white/70"
                    style={{
                      left: `${(piece * 13) % 100}%`,
                      top: `${(piece * 7) % 100}%`,
                    }}
                    animate={{
                      y: [0, 180, 360],
                      x: [0, (piece % 2 === 0 ? 20 : -20), 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 6 + (piece % 5),
                      repeat: Infinity,
                      delay: piece * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0">
                {['10%', '35%', '70%'].map((left, index) => (
                  <motion.div
                    key={left}
                    className="absolute top-10 h-2 w-2 rounded-full bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.6)]"
                    style={{ left }}
                    animate={{ scale: [1, 6, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      delay: index * 1.2,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-12">
              <div className="text-center">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {newYearTimeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base text-white/70 uppercase tracking-wide">
                  Days
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 sm:h-16 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {newYearTimeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base text-white/70 uppercase tracking-wide">
                  Hours
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 sm:h-16 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {newYearTimeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base text-white/70 uppercase tracking-wide">
                  Minutes
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 sm:h-16 bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  {newYearTimeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base text-white/70 uppercase tracking-wide">
                  Seconds
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Get the next upcoming event (the one happening soonest)
  const nextEvent = events.filter(event => {
    try {
      // Parse date and time - handle different date formats
      let eventDateTime: Date;
      if (event.date && event.time) {
        // Try parsing as "YYYY-MM-DD HH:MM" format first
        const dateTimeString = `${event.date} ${event.time}`;
        eventDateTime = new Date(dateTimeString);
        
        // If invalid, try alternative parsing
        if (isNaN(eventDateTime.getTime())) {
          // Try parsing date separately
          const dateParts = event.date.split('-');
          const timeParts = event.time.split(':');
          if (dateParts.length === 3 && timeParts.length >= 2) {
            eventDateTime = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2]),
              parseInt(timeParts[0]),
              parseInt(timeParts[1]) || 0
            );
          }
        }
      } else {
        return false;
      }
      
    const now = new Date();
      const isUpcoming = eventDateTime.getTime() > now.getTime();
      
      if (isUpcoming) {
        console.log('CountdownSection: Found upcoming event:', event.title, 'Date:', eventDateTime);
      }
      
      return isUpcoming;
    } catch (error) {
      console.error('CountdownSection: Error parsing event date:', event, error);
      return false;
    }
  }).sort((a, b) => {
    try {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
    } catch (error) {
      return 0;
    }
  })[0]; // Get only the next upcoming event

  console.log('CountdownSection: Total events:', events.length, 'Next event:', nextEvent?.title || 'None');

  if (isLoading) {
    return (
      <section ref={ref} className={`py-16 bg-gradient-to-b from-black/95 to-black/90 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Loading upcoming events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!nextEvent) {
    // Show a message when there are no upcoming events
    return (
      <section ref={ref} className={`py-12 sm:py-16 bg-gradient-to-b from-black/95 to-black/90 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              Upcoming <span className="text-white">Events</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-6">
              Check back soon for our upcoming events and activities.
            </p>
            <motion.a
              href="/events"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="h-5 w-5 mr-2" />
              View All Events
            </motion.a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`py-12 sm:py-16 bg-gradient-to-b from-black/95 to-black/90 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Next <span className="text-white">Event</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join us for this special moment of fellowship, worship, and community. 
            Don't miss out on what God has planned for our church family.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-lg p-4 sm:p-6 hover-elevate transition-all duration-300 border border-white/20"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            {/* Event Info - Left Side */}
            <div className="flex-1 md:pr-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3 break-words">
                {nextEvent.title}
              </h3>
              
              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-white/70">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">{nextEvent.date}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">{nextEvent.time}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base break-words">{nextEvent.location}</span>
                </div>
              </div>

              <div className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {nextEvent.category}
              </div>
            </div>

            {/* Countdown Clock - Right Side */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <EventCountdown
                eventDate={nextEvent.date}
                eventTime={nextEvent.time}
                eventTitle={nextEvent.title}
                eventImage={nextEvent.image}
                className="w-full max-w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-white/70 mb-6">
            Want to see all our events and register for upcoming activities?
          </p>
          <motion.a
            href="/events"
            className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="h-5 w-5 mr-2" />
            View All Events
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
