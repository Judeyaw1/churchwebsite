import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import CountdownClock from '@/components/CountdownClock';

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

interface UpcomingEventsSectionProps {
  className?: string;
}

export default function UpcomingEventsSection({ className = '' }: UpcomingEventsSectionProps) {
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

  // Get upcoming events (events that haven't happened yet)
  const upcomingEvents = events.filter(event => {
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    const now = new Date();
    return eventDateTime > now;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  }).slice(0, 2); // Show only the next 2 upcoming events

  if (isLoading) {
    return (
      <section ref={ref} className={`py-20 bg-black/95 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Loading upcoming events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return null; // Don't show the section if there are no upcoming events
  }

  return (
    <section ref={ref} className={`py-20 bg-black/95 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6">
            Upcoming <span className="text-white">Events</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Join us for these special moments of fellowship, worship, and community. 
            Don't miss out on what God has planned for our church family.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <CountdownClock
                eventDate={event.date}
                eventTime={event.time}
                eventTitle={event.title}
                eventLocation={event.location}
                showEventDetails={true}
              />
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
