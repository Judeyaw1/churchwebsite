import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, Users, Music, Baby, GraduationCap } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithCache } from '@/lib/fetchWithCache';

interface ServicesSectionProps {
  className?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationRequired: boolean;
  image?: string;
}

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      // Add cache-busting parameter to ensure fresh data
      const eventsData = await fetchWithCache<Event[]>('/api/events', {
        ttl: 1000 * 60,
      });
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const services = [
    {
      id: 'sunday-worship',
      title: 'Sunday Worship',
      time: '9:00 AM & 11:00 AM',
      description: 'Join us for inspiring worship, biblical teaching, and community fellowship.',
      icon: Music,
      details: 'Our Sunday services include contemporary worship music, practical biblical teaching, and time for community connection. Childcare is available for all ages.'
    },
    {
      id: 'bible-study',
      title: 'Midweek Bible Study',
      time: 'Wednesdays 7:00 PM',
      description: 'Dive deeper into God\'s word with interactive study and discussion.',
      icon: GraduationCap,
      details: 'Interactive Bible study sessions where we explore Scripture together, ask questions, and grow in our understanding of God\'s word.'
    },
    {
      id: 'youth-group',
      title: 'Youth Ministry',
      time: 'Fridays 6:30 PM',
      description: 'Fun, faith-building activities for teens and young adults.',
      icon: Users,
      details: 'Age-appropriate programming for teens including games, worship, biblical teaching, and community service opportunities.'
    },
    {
      id: 'kids-ministry',
      title: 'Children\'s Ministry',
      time: 'Sundays during service',
      description: 'Engaging programs for children of all ages during worship.',
      icon: Baby,
      details: 'Safe, fun, and educational programs designed to help children learn about God\'s love through stories, games, and activities.'
    }
  ];

  // Get upcoming events (limit to 4 most recent)
  const upcomingEvents = events.slice(0, 4);

  return (
    <section ref={ref} className={`py-20 bg-black/95 ${className}`} id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 sm:mb-6">
            Services & <span className="text-white">Programs</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            We offer various ways to connect with God and our community throughout the week. 
            Find the right fit for you and your family.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className={`hover-elevate transition-all duration-300 cursor-pointer border-2 bg-white/5 ${
                      selectedService === service.id 
                        ? 'border-white/30 bg-white/10' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                    data-testid={`card-service-${service.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-white/10 p-2 rounded-lg mr-3">
                            <service.icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white">{service.title}</CardTitle>
                            <div className="flex items-center text-sm text-white/70 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 mb-3">
                        {service.description}
                      </p>
                      
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: selectedService === service.id ? 'auto' : 0,
                          opacity: selectedService === service.id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-white/20">
                          <p className="text-sm text-white/80 leading-relaxed">
                            {service.details}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 border-white/30 text-white hover:bg-white/10"
                            data-testid={`button-learn-more-${service.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Learn more about ${service.title}`);
                            }}
                          >
                            Learn More
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24 bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Calendar className="h-5 w-5 mr-2 text-white" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-white/70 py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    Loading events...
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 hover-elevate transition-all duration-300 border border-white/10"
                      data-testid={`event-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <div className="flex items-center text-sm text-white/70 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                          <span className="inline-block bg-white/10 text-white px-2 py-1 rounded text-xs mt-2">
                            {event.category}
                          </span>
                        </div>
                        <div className="text-center ml-4">
                          <div className="bg-white/20 text-white rounded-lg px-3 py-2 text-sm font-medium">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-white/70 py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming events</p>
                    <p className="text-sm mt-2">Check back later for new events!</p>
                  </div>
                )}
                
                <Link href="/events">
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-white/30 text-white hover:bg-white/10"
                    data-testid="button-view-all-events"
                  >
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
