import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import EventCountdown from '@/components/EventCountdown';

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const eventsData = await response.json();
          setEvents(eventsData);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get the next upcoming event (the one happening soonest)
  const nextEvent = events.filter(event => {
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    const now = new Date();
    return eventDateTime > now;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  })[0]; // Get only the next upcoming event

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
    return null; // Don't show the section if there are no upcoming events
  }

  return (
    <section ref={ref} className={`py-16 bg-gradient-to-b from-black/95 to-black/90 ${className}`}>
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
          className="bg-white/5 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20"
        >
          <div className="flex items-center justify-between">
            {/* Event Info - Left Side */}
            <div className="flex-1 pr-8">
              <h3 className="text-2xl font-semibold text-white mb-3">{nextEvent.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-white/70">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-base">{nextEvent.date}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-base">{nextEvent.time}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-base">{nextEvent.location}</span>
                </div>
              </div>

              <div className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium">
                {nextEvent.category}
              </div>
            </div>

            {/* Countdown Clock - Right Side */}
            <div className="flex-shrink-0">
              <EventCountdown
                eventDate={nextEvent.date}
                eventTime={nextEvent.time}
                eventTitle={nextEvent.title}
                className="w-full"
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
