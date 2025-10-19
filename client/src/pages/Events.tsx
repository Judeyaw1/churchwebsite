import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Search, X, Mail, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CountdownClock from '@/components/CountdownClock';
import CompactCountdown from '@/components/CompactCountdown';

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

export default function Events() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '0',
    message: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from database
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      // Add cache-busting parameter to ensure fresh data
      const response = await fetch(`/api/events?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
        console.log('Events fetched:', eventsData); // Debug log
        console.log('Christmas event image:', eventsData.find(e => e.title.includes('Christmas'))?.image);
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


  const categories = ['all', 'Special Event', 'Worship Service', 'Special Service', 'Membership', 'Youth', 'Community Service', 'Adult Ministry', 'Children\'s Ministry'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get upcoming events (events that haven't happened yet)
  const upcomingEvents = events.filter(event => {
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    const now = new Date();
    return eventDateTime > now;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Special Event': 'bg-purple-100 text-purple-800',
      'Worship Service': 'bg-blue-100 text-blue-800',
      'Special Service': 'bg-red-100 text-red-800',
      'Membership': 'bg-green-100 text-green-800',
      'Youth': 'bg-orange-100 text-orange-800',
      'Community Service': 'bg-yellow-100 text-yellow-800',
      'Adult Ministry': 'bg-indigo-100 text-indigo-800',
      'Children\'s Ministry': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navigation */}
      <Navigation />
      

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-black/80 to-black/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6">
                Church <span className="text-white">Events</span>
              </h1>
              <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                Join us for worship, fellowship, and community events throughout the year. 
                Find meaningful ways to connect with God and your church family.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section ref={ref} className="py-20 bg-black/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                {/* Search */}
                <div className="relative w-full sm:w-80 lg:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>

                {/* Category Filter and Refresh */}
                <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-end">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`capitalize ${
                        selectedCategory === category 
                          ? "bg-white text-black hover:bg-white/90" 
                          : "border-white/30 text-white hover:bg-white/10"
                      }`}
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      {category}
                    </Button>
                  ))}
                  
                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Force refresh with cache clearing
                      window.location.reload();
                    }}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Force Refresh
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading events...</p>
              </div>
            )}

            {/* Events Header */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">Church Events</h2>
                  <p className="text-white/70">Join us for worship, fellowship, and community events</p>
                </div>
              </motion.div>
            )}

            {/* Events Grid */}
            {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map((event, index) => {
                console.log('Rendering event:', event.title, 'with image:', event.image);
                return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="hover-elevate transition-all duration-300 overflow-hidden bg-white/5 border-white/20">
                    {/* Event Image */}
                    <div className="aspect-video overflow-hidden relative">
                      {event.image ? (
                      <img
                        src={`${event.image}?v=${Math.random()}`}
                        alt={event.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onLoad={() => {
                            console.log('Image loaded successfully:', event.image);
                            console.log('Full image URL:', `${event.image}?v=${Math.random()}`);
                          }}
                          onError={(e) => {
                            console.error('Image failed to load:', event.image);
                            console.error('Failed URL:', e.currentTarget.src);
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center absolute top-0 left-0"
                        style={{ display: event.image ? 'none' : 'flex' }}
                      >
                        <Calendar className="h-16 w-16 text-white/60" />
                      </div>
                    </div>

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 text-white">{event.title}</CardTitle>
                          <div className="flex items-center text-sm text-white/70 mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </div>
                          <div className="flex items-center text-sm text-white/70 mb-2">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-sm text-white/70 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <Badge className={`mb-3 ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </Badge>

                      {/* Mini Countdown for upcoming events */}
                      {(() => {
                        const eventDateTime = new Date(`${event.date} ${event.time}`);
                        const now = new Date();
                        const isUpcoming = eventDateTime > now;
                        
                        if (isUpcoming) {
                          return (
                            <div className="mb-4 flex justify-center">
                              <CompactCountdown
                                eventDate={event.date}
                                eventTime={event.time}
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <p className="text-white/80 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      {/* Attendee Info */}
                      {event.maxAttendees && (
                        <div className="flex items-center text-sm text-white/70 mb-4">
                          <Users className="h-4 w-4 mr-1" />
                          {event.currentAttendees}/{event.maxAttendees} registered
                        </div>
                      )}

                      {/* Registration Status */}
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={event.registrationRequired ? "default" : "secondary"}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                            event.registrationRequired 
                              ? "bg-white/20 text-white hover:bg-white/30" 
                              : "bg-white/10 text-white/80 hover:bg-white/20"
                          }`}
                          onClick={() => {
                            if (event.registrationRequired) {
                              setSelectedEvent(event);
                              setShowRegistrationForm(true);
                            } else {
                              setSelectedEvent(event);
                            }
                          }}
                        >
                          {event.registrationRequired ? "Registration Required" : "Open to All"}
                        </Badge>
                        
                        {event.registrationRequired && (
                        <Button
                          size="sm"
                            variant="default"
                            className="bg-white text-black hover:bg-white/90"
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowRegistrationForm(true);
                            }}
                          >
                            Register
                        </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                );
              })}
            </div>
            )}

            {/* No Results */}
            {!isLoading && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Calendar className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                <p className="text-white/80">
                  Try adjusting your search or filter criteria.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && !showRegistrationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-t-2xl relative">
                {selectedEvent.image ? (
                  <img
                    src={`${selectedEvent.image}?v=${Math.random()}`}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Modal image failed to load:', selectedEvent.image);
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center absolute top-0 left-0"
                  style={{ display: selectedEvent.image ? 'none' : 'flex' }}
                >
                  <Calendar className="h-24 w-24 text-white/60" />
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  {selectedEvent.title}
                </h2>
                <Badge className={`mb-4 ${getCategoryColor(selectedEvent.category)}`}>
                  {selectedEvent.category}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{selectedEvent.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{selectedEvent.time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedEvent.location}</p>
                  </div>
                </div>
                {selectedEvent.maxAttendees && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Attendance</p>
                      <p className="font-medium text-gray-900">
                        {selectedEvent.currentAttendees}/{selectedEvent.maxAttendees} registered
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                {selectedEvent.registrationRequired ? (
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowRegistrationForm(true)}
                  >
                    Register Now
                  </Button>
                ) : (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      console.log(`Attending ${selectedEvent.title}`);
                      setSelectedEvent(null);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    I'll Attend
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => console.log(`Contact about ${selectedEvent.title}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showRegistrationForm && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowRegistrationForm(false);
              setRegistrationSuccess(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
            {!registrationSuccess ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold text-gray-900">
                      Register for {selectedEvent.title}
                    </h2>
                    <button
                      onClick={() => {
                        setShowRegistrationForm(false);
                        setSelectedEvent(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedEvent.date} • {selectedEvent.time}
                  </p>
                </div>

                <form
                  className="p-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Registration submitted:', registrationForm);
                    setRegistrationSuccess(true);
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      required
                      value={registrationForm.name}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      required
                      value={registrationForm.email}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={registrationForm.phone}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={registrationForm.guests}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, guests: e.target.value }))}
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests or Questions
                    </label>
                    <textarea
                      value={registrationForm.message}
                      onChange={(e) => setRegistrationForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Any dietary restrictions, accessibility needs, or questions..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Submit Registration
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowRegistrationForm(false);
                        setSelectedEvent(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Registration Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                  Thank you for registering for <strong>{selectedEvent.title}</strong>. 
                  You will receive a confirmation email shortly.
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setShowRegistrationForm(false);
                      setSelectedEvent(null);
                      setRegistrationSuccess(false);
                      setRegistrationForm({ name: '', email: '', phone: '', guests: '0', message: '' });
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setRegistrationSuccess(false)}
                  >
                    Register for Another Event
                  </Button>
                </div>
              </div>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
