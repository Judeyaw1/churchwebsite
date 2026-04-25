import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Mail,
  MapPin,
  Search,
  Users,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CompactCountdown from '@/components/CompactCountdown';
import PublicPageHero from '@/components/PublicPageHero';
import PublicPageLayout from '@/components/PublicPageLayout';

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

const categories = [
  'all',
  'Special Event',
  'Worship Service',
  'Special Service',
  'Membership',
  'Youth',
  'Community Service',
  'Adult Ministry',
  "Children's Ministry",
];

const parseEventDateTime = (date: string, time: string) => {
  const primaryTime = time.split('-')[0]?.trim() ?? time;
  return new Date(`${date} ${primaryTime}`);
};

const formatEventDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatEventChipDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getCategoryTone = (category: string) => {
  const styles: Record<string, string> = {
    'Special Event': 'border-white/20 bg-white/10 text-white',
    'Worship Service': 'border-white/20 bg-white/10 text-white',
    'Special Service': 'border-white/20 bg-white/10 text-white',
    Membership: 'border-white/20 bg-white/10 text-white',
    Youth: 'border-white/20 bg-white/10 text-white',
    'Community Service': 'border-white/20 bg-white/10 text-white',
    'Adult Ministry': 'border-white/20 bg-white/10 text-white',
    "Children's Ministry": 'border-white/20 bg-white/10 text-white',
  };

  return styles[category] ?? 'border-white/15 bg-white/10 text-white';
};

const emptyRegistrationForm = {
  name: '',
  email: '',
  phone: '',
  guests: '1',
  guestNames: '',
  message: '',
};

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState(emptyRegistrationForm);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState(false);
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detailImageErrored, setDetailImageErrored] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/events?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

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

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setDetailImageErrored(false);
  }, [selectedEvent?.id]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => parseEventDateTime(a.date, a.time).getTime() - parseEventDateTime(b.date, b.time).getTime(),
      ),
    [events],
  );

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return sortedEvents.filter((event) => parseEventDateTime(event.date, event.time).getTime() > now);
  }, [sortedEvents]);

  const featuredEvent = upcomingEvents[0] ?? sortedEvents[0] ?? null;

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, sortedEvents]);

  const openEventsCount = events.filter((event) => !event.registrationRequired).length;
  const registrationEventsCount = events.filter((event) => event.registrationRequired).length;
  const totalAttendees = events.reduce((sum, event) => sum + (event.currentAttendees ?? 0), 0);

  const resetSelectionState = () => {
    setSelectedEvent(null);
    setShowRegistrationForm(false);
    setRegistrationSuccess(false);
    setRegistrationError(null);
    setRegistrationForm(emptyRegistrationForm);
    setRsvpEmail('');
    setRsvpError(null);
    setRsvpSuccess(false);
  };

  const submitRegistration = async () => {
    if (!selectedEvent) return;

    setIsSubmittingRegistration(true);
    setRegistrationError(null);

    try {
      const resp = await fetch(`/api/events/${selectedEvent.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registrationForm.name,
          email: registrationForm.email,
          phone: registrationForm.phone,
          guests: registrationForm.guests,
          guestNames: registrationForm.guestNames,
          message: registrationForm.message,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
      }

      setRegistrationSuccess(true);
      fetchEvents();
    } catch (error: any) {
      setRegistrationError(error.message || 'Registration failed');
    } finally {
      setIsSubmittingRegistration(false);
    }
  };

  const submitRsvp = async () => {
    if (!selectedEvent || !rsvpEmail) return;

    setIsSubmittingRsvp(true);
    setRsvpError(null);

    try {
      const resp = await fetch(`/api/events/${selectedEvent.id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: rsvpEmail,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'RSVP failed');
      }

      setRsvpSuccess(true);
      setRsvpEmail('');
      fetchEvents();
    } catch (error: any) {
      setRsvpError(error.message || 'RSVP failed');
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  return (
    <PublicPageLayout>
      <PublicPageHero
        title="Church Events"
        description="A clearer way to see what is next, where to show up, and how to join the life of the church."
        align="center"
      />

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_38%,rgba(176,126,37,0.16)_100%)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
                  Event Calendar
                </span>
                {featuredEvent && (
                  <Badge className={`rounded-full border px-3 py-1 text-xs ${getCategoryTone(featuredEvent.category)}`}>
                    {featuredEvent.category}
                  </Badge>
                )}
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/52">Featured Gathering</p>
                  <h2 className="mt-4 max-w-2xl font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                    {featuredEvent ? featuredEvent.title : 'Watch this space for our next church gathering.'}
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                    {featuredEvent
                      ? featuredEvent.description
                      : 'As new services, workshops, and church-wide moments are scheduled, they will appear here first.'}
                  </p>

                  {featuredEvent && (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Date</p>
                        <p className="mt-2 text-base font-medium text-white">{formatEventDate(featuredEvent.date)}</p>
                      </div>
                      <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-white/45">Location</p>
                        <p className="mt-2 text-base font-medium text-white">{featuredEvent.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {featuredEvent && (
                      <Button
                        className="rounded-full bg-white px-6 text-black hover:bg-white/90"
                        onClick={() => setSelectedEvent(featuredEvent)}
                      >
                        View Event Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="rounded-full border-white/20 bg-white/5 px-6 text-white hover:bg-white/10"
                      onClick={fetchEvents}
                    >
                      Refresh Calendar
                    </Button>
                  </div>
                </div>

                <div className="rounded-[1.8rem] border border-white/10 bg-black/30 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Upcoming</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{upcomingEvents.length}</p>
                      <p className="mt-2 text-sm text-white/62">Scheduled gatherings still ahead.</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Open To All</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{openEventsCount}</p>
                      <p className="mt-2 text-sm text-white/62">Events that do not require registration.</p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Responses</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{totalAttendees}</p>
                      <p className="mt-2 text-sm text-white/62">Total recorded registrations and RSVPs.</p>
                    </div>
                  </div>

                  {featuredEvent && (
                    <div className="mt-5 rounded-[1.5rem] border border-[#b28a3b]/25 bg-[#100d07] p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-[#d7be8d]">Next Up</p>
                          <p className="mt-2 text-lg font-semibold text-white">{featuredEvent.time}</p>
                        </div>
                        <div className="rounded-full border border-[#d7be8d]/30 bg-[#d7be8d]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#f3e2ba]">
                          {formatEventChipDate(featuredEvent.date)}
                        </div>
                      </div>
                      <div className="mt-4">
                        <CompactCountdown eventDate={featuredEvent.date} eventTime={featuredEvent.time} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.2)]"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">How It Works</p>
              <h3 className="mt-4 font-serif text-3xl text-white">Plan your week with the church.</h3>

              <div className="mt-8 space-y-4">
                {[
                  {
                    value: upcomingEvents.length || 0,
                    label: 'Upcoming events',
                    detail: 'See what is scheduled next and decide where to join in.',
                  },
                  {
                    value: registrationEventsCount || 0,
                    label: 'Registration-based gatherings',
                    detail: 'Reserve your place early for workshops, retreats, and special programs.',
                  },
                  {
                    value: new Set(events.map((event) => event.category)).size || 0,
                    label: 'Ministry categories',
                    detail: 'Browse worship, youth, community, membership, and family moments.',
                  },
                ].map((item, index) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm uppercase tracking-[0.2em] text-white/42">0{index + 1}</span>
                      <span className="text-3xl font-semibold text-white">{item.value}</span>
                    </div>
                    <p className="mt-4 text-lg font-medium text-white">{item.label}</p>
                    <p className="mt-2 text-sm leading-7 text-white/62">{item.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 rounded-[2rem] border border-white/10 bg-[#0a0a0a]/85 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:p-6"
          >
            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Find Events</p>
                <h3 className="mt-3 font-serif text-2xl text-white sm:text-3xl">Filter the calendar by need, season, or ministry.</h3>
              </div>

              <div className="grid gap-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                  <Input
                    placeholder="Search by title, location, or description"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="h-12 rounded-full border-white/12 bg-white/5 pl-11 text-white placeholder:text-white/42"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full border px-4 ${
                        selectedCategory === category
                          ? 'border-white bg-white text-black hover:bg-white/90'
                          : 'border-white/15 bg-white/[0.03] text-white hover:bg-white/10'
                      }`}
                    >
                      <Filter className="mr-2 h-3.5 w-3.5" />
                      {category === 'all' ? 'All Events' : category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[26rem] animate-pulse rounded-[1.9rem] border border-white/10 bg-white/[0.04]"
                />
              ))}

            {!isLoading &&
              filteredEvents.map((event, index) => {
                const isUpcoming = parseEventDateTime(event.date, event.time).getTime() > Date.now();

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: index * 0.05 }}
                  >
                    <Card className="group h-full overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]">
                      <div
                        className="relative h-56 cursor-pointer overflow-hidden border-b border-white/10"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.image ? (
                          <>
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.72))]" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30%),linear-gradient(135deg,#181818_0%,#0d0d0d_58%,#241b09_100%)]" />
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <Badge className={`rounded-full border px-3 py-1 text-xs ${getCategoryTone(event.category)}`}>
                              {event.category}
                            </Badge>
                            <div className="rounded-[1rem] border border-white/10 bg-black/45 px-3 py-2 text-right backdrop-blur-sm">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Date</p>
                              <p className="mt-1 text-sm font-semibold text-white">{formatEventChipDate(event.date)}</p>
                            </div>
                          </div>
                          <h3 className="mt-4 text-2xl font-semibold text-white">{event.title}</h3>
                        </div>
                      </div>

                      <CardContent className="flex h-[calc(100%-14rem)] flex-col p-6">
                        <div className="space-y-3 text-sm text-white">
                          <div className="flex items-center gap-3 text-white">
                            <Calendar className="h-4 w-4 text-white/45" />
                            <span>{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-3 text-white">
                            <Clock className="h-4 w-4 text-white/45" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-white">
                            <MapPin className="h-4 w-4 text-white/45" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {isUpcoming && (
                          <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-black/25 p-3">
                            <CompactCountdown eventDate={event.date} eventTime={event.time} />
                          </div>
                        )}

                        <p className="mt-5 line-clamp-4 text-sm leading-7 text-white">{event.description}</p>

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/62">
                          {event.maxAttendees ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                              <Users className="h-4 w-4" />
                              {event.currentAttendees ?? 0}/{event.maxAttendees} registered
                            </span>
                          ) : event.currentAttendees ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                              <Users className="h-4 w-4" />
                              {event.currentAttendees} planning to attend
                            </span>
                          ) : null}

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                              event.registrationRequired
                                ? 'border-white/20 bg-white/10 text-white'
                                : 'border-white/20 bg-white/10 text-white'
                            }`}
                          >
                            {event.registrationRequired ? 'Registration required' : 'Open to all'}
                          </span>
                        </div>

                        <div className="mt-auto flex gap-3 pt-6">
                          <Button
                            variant="outline"
                            className="flex-1 rounded-full border-white/15 bg-white/[0.03] text-white hover:bg-white/10"
                            onClick={() => setSelectedEvent(event)}
                          >
                            Learn More
                          </Button>
                          <Button
                            className="flex-1 rounded-full bg-white text-black hover:bg-white/90"
                            onClick={() => {
                              setSelectedEvent(event);

                              if (event.registrationRequired) {
                                setShowRegistrationForm(true);
                              }
                            }}
                          >
                            {event.registrationRequired ? 'Register' : 'RSVP'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>

          {!isLoading && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center"
            >
              <Calendar className="mx-auto h-14 w-14 text-white/35" />
              <h3 className="mt-5 text-2xl font-semibold text-white">No matching events</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/62">
                Change the filter, clear the search, or refresh the calendar to see the latest church events.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedEvent && !showRegistrationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/78 px-4 pb-6 pt-24 backdrop-blur-md sm:px-6 sm:pt-28"
            onClick={resetSelectionState}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="my-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/12 bg-[#0b0b0b] shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative min-h-[18rem] overflow-hidden border-b border-white/10 sm:min-h-[21rem]">
                {selectedEvent.image && !detailImageErrored ? (
                  <>
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="h-full w-full object-cover"
                      onError={() => setDetailImageErrored(true)}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.84))]" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),linear-gradient(135deg,#171717_0%,#090909_56%,#2a200d_100%)]" />
                )}

                <button
                  onClick={resetSelectionState}
                  className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-black/55 p-2 text-white transition hover:bg-black/70"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="max-w-3xl">
                    <Badge className={`rounded-full border px-3 py-1 text-xs ${getCategoryTone(selectedEvent.category)}`}>
                      {selectedEvent.category}
                    </Badge>
                    <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                      {selectedEvent.title}
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/78">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                        <Calendar className="h-4 w-4" />
                        {formatEventDate(selectedEvent.date)}
                      </span>
                      {selectedEvent.time && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                          <Clock className="h-4 w-4" />
                          {selectedEvent.time}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                        {selectedEvent.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6 sm:p-8">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                    <Calendar className="h-5 w-5 text-white/55" />
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">Date</p>
                    <p className="mt-2 text-sm font-medium text-white">{formatEventDate(selectedEvent.date)}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                    <Clock className="h-5 w-5 text-white/55" />
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">Time</p>
                    <p className="mt-2 text-sm font-medium text-white">{selectedEvent.time}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                    <MapPin className="h-5 w-5 text-white/55" />
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">Location</p>
                    <p className="mt-2 text-sm font-medium text-white">{selectedEvent.location}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-4">
                    <Users className="h-5 w-5 text-white/55" />
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">Attendance</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {selectedEvent.maxAttendees
                        ? `${selectedEvent.currentAttendees ?? 0}/${selectedEvent.maxAttendees} registered`
                        : selectedEvent.currentAttendees
                          ? `${selectedEvent.currentAttendees} planning to attend`
                          : selectedEvent.registrationRequired
                            ? 'Registration available'
                            : 'Open gathering'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem] xl:items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">About This Event</p>
                    <p className="mt-4 max-w-3xl text-base leading-8 text-white/76">{selectedEvent.description}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 xl:sticky xl:top-0">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">Attendance Options</p>

                    {selectedEvent.registrationRequired ? (
                      <div className="mt-5 space-y-4">
                        <p className="text-sm leading-7 text-white/68">
                          This event requires registration so the team can prepare seating, materials, or logistics.
                        </p>
                        <Button
                          className="w-full rounded-full bg-white text-black hover:bg-white/90"
                          onClick={() => {
                            setRegistrationError(null);
                            setRegistrationSuccess(false);
                            setRsvpError(null);
                            setRsvpSuccess(false);
                            setRsvpEmail('');
                            setShowRegistrationForm(true);
                          }}
                        >
                          Register Now
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {!rsvpSuccess ? (
                          <>
                            <p className="text-sm leading-7 text-white/68">
                              Let the church know you plan to attend so the team can prepare well.
                            </p>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              value={rsvpEmail}
                              onChange={(event) => setRsvpEmail(event.target.value)}
                              className="h-11 rounded-full border-white/12 bg-black/25 text-white placeholder:text-white/38"
                            />
                            <Button
                              className="w-full rounded-full bg-[#d7be8d] text-black hover:bg-[#e3c99a]"
                              onClick={submitRsvp}
                              disabled={!rsvpEmail || isSubmittingRsvp}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {isSubmittingRsvp ? 'Submitting...' : "I'll Attend"}
                            </Button>
                            {rsvpError && <p className="text-sm text-red-300">{rsvpError}</p>}
                          </>
                        ) : (
                          <div className="rounded-[1.2rem] border border-emerald-300/20 bg-emerald-300/10 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-emerald-200">
                              <CheckCircle className="h-5 w-5" />
                              <p className="font-medium">You are on the list.</p>
                            </div>
                            <Button
                              variant="outline"
                              className="mt-4 w-full rounded-full border-white/15 bg-transparent text-white hover:bg-white/8"
                              onClick={() => {
                                setRsvpSuccess(false);
                                setRsvpEmail('');
                                setRsvpError(null);
                              }}
                            >
                              RSVP for Someone Else
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    <a href="mailto:info@ubpchurch.org" className="mt-4 block">
                      <Button
                        variant="outline"
                        className="w-full rounded-full border-white/15 bg-transparent text-white hover:bg-white/8"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact The Church
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegistrationForm && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/78 px-4 pb-6 pt-24 backdrop-blur-md sm:px-6 sm:pt-28"
            onClick={resetSelectionState}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-white/12 bg-[#0b0b0b] shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
              onClick={(event) => event.stopPropagation()}
            >
              {!registrationSuccess ? (
                <>
                  <div className="border-b border-white/10 p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/45">Registration</p>
                        <h2 className="mt-3 font-serif text-2xl text-white">Register for {selectedEvent.title}</h2>
                        <p className="mt-2 text-sm text-white/58">
                          {formatEventDate(selectedEvent.date)} at {selectedEvent.time}
                        </p>
                      </div>
                      <button onClick={resetSelectionState} className="rounded-full border border-white/12 p-2 text-white/72 hover:bg-white/6">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form
                    className="space-y-4 p-6 sm:p-7"
                    onSubmit={(event) => {
                      event.preventDefault();
                      submitRegistration();
                    }}
                  >
                    <div>
                      <label className="mb-2 block text-sm text-white/72">Full Name *</label>
                      <Input
                        type="text"
                        required
                        value={registrationForm.name}
                        onChange={(event) => setRegistrationForm((prev) => ({ ...prev, name: event.target.value }))}
                        className="h-11 rounded-full border-white/12 bg-black/25 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/72">Email Address *</label>
                      <Input
                        type="email"
                        required
                        value={registrationForm.email}
                        onChange={(event) => setRegistrationForm((prev) => ({ ...prev, email: event.target.value }))}
                        className="h-11 rounded-full border-white/12 bg-black/25 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/72">Phone Number</label>
                      <Input
                        type="tel"
                        value={registrationForm.phone}
                        onChange={(event) => setRegistrationForm((prev) => ({ ...prev, phone: event.target.value }))}
                        className="h-11 rounded-full border-white/12 bg-black/25 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/72">Number of Guests</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={registrationForm.guests}
                        onChange={(event) => setRegistrationForm((prev) => ({ ...prev, guests: event.target.value }))}
                        className="h-11 rounded-full border-white/12 bg-black/25 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/72">Other Guest Names</label>
                      <textarea
                        value={registrationForm.guestNames}
                        onChange={(event) =>
                          setRegistrationForm((prev) => ({ ...prev, guestNames: event.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-[1.25rem] border border-white/12 bg-black/25 p-3 text-white outline-none focus:border-white/28"
                        placeholder="List additional guest names"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-white/72">Special Requests or Questions</label>
                      <textarea
                        value={registrationForm.message}
                        onChange={(event) => setRegistrationForm((prev) => ({ ...prev, message: event.target.value }))}
                        rows={4}
                        className="w-full rounded-[1.25rem] border border-white/12 bg-black/25 p-3 text-white outline-none focus:border-white/28"
                        placeholder="Accessibility needs, dietary notes, or anything the team should know"
                      />
                    </div>

                    {registrationError && <p className="text-sm text-red-300">{registrationError}</p>}

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                      <Button
                        type="submit"
                        disabled={isSubmittingRegistration}
                        className="flex-1 rounded-full bg-white text-black hover:bg-white/90"
                      >
                        {isSubmittingRegistration ? 'Submitting...' : 'Submit Registration'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 rounded-full border-white/15 bg-transparent text-white hover:bg-white/8"
                        onClick={resetSelectionState}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="p-8 text-center sm:p-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="mt-6 font-serif text-3xl text-white">Registration Received</h2>
                  <p className="mt-4 text-sm leading-7 text-white/68">
                    You are registered for <strong>{selectedEvent.title}</strong>. A confirmation message will follow shortly.
                  </p>
                  <div className="mt-8 space-y-3">
                    <Button
                      className="w-full rounded-full bg-white text-black hover:bg-white/90"
                      onClick={resetSelectionState}
                    >
                      Close
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-white/15 bg-transparent text-white hover:bg-white/8"
                      onClick={() => {
                        setRegistrationSuccess(false);
                        setRegistrationForm(emptyRegistrationForm);
                      }}
                    >
                      Register Another Person
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PublicPageLayout>
  );
}
