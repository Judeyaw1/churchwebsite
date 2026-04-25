import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Baby,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Music,
  Users,
} from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
}

const services = [
  {
    id: 'sunday-services',
    title: 'Sunday Services',
    time: '10:00 AM',
    icon: Music,
    description: 'Worship, biblical preaching, and a warm church family gathered in one room.',
    detail:
      'A Sunday rhythm built for prayer, Scripture, song, and meaningful community connection.',
  },
  {
    id: 'weekly-bible-study',
    title: 'Weekly Bible Study',
    time: 'Mon - Thurs 8:00 PM',
    icon: GraduationCap,
    description: 'Evening study sessions that help the church grow deeper in God’s word.',
    detail:
      'Interactive teaching, honest questions, and discipleship shaped around regular midweek devotion.',
  },
  {
    id: 'prayer-meeting',
    title: 'Prayer Meeting',
    time: 'Fridays 8:00 PM',
    icon: Users,
    description: 'A dedicated time for intercession, faith, and spiritual renewal together.',
    detail:
      'A prayer-centered gathering where the church seeks God together with expectancy and unity.',
  },
  {
    id: 'childrens-ministry',
    title: "Children's Ministry",
    time: 'Sundays during service',
    icon: Baby,
    description: 'Age-appropriate teaching and care for children while families worship.',
    detail:
      'A safe and joyful space where children learn Scripture and experience belonging in the church.',
  },
];

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
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

    fetchEvents();
  }, []);

  const upcomingEvents = events.slice(0, 4);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${className}`}
      id="services"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.025)_14%,transparent_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7 }}
          className="mb-12 grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/65">Worship Life</p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              A weekly rhythm built for formation, fellowship, and prayer.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            The homepage should tell visitors what it feels like to belong here. These gatherings
            make that clear: worship on Sunday, study through the week, prayer on Friday, and
            space for families to grow together.
          </p>
        </motion.div>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="grid gap-5 md:grid-cols-2"
          >
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white/10 text-white">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/55">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </div>

                  <div className="mt-8">
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/65">
                      {service.time}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{service.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white">{service.description}</p>
                    <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-white/55">
                      {service.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b]/90 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.38)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Calendar</p>
                  <h3 className="mt-2 font-serif text-3xl text-white">Upcoming Events</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/65">
                    Loading events...
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                            {event.category}
                          </p>
                          <h4 className="mt-2 text-lg font-semibold text-white">{event.title}</h4>
                        </div>
                        <div className="rounded-2xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/65">
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.location || 'Church campus'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-white/65">
                    No upcoming events yet. Check back soon for new gatherings and church updates.
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/65">Need Details?</p>
                <p className="mt-3 text-sm leading-7 text-white/78">
                  Visit the events page for full schedules, announcements, and registration details.
                </p>
                <Link href="/events">
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                    data-testid="button-view-all-events"
                  >
                    View All Events
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
