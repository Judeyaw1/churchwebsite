import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin } from 'lucide-react';

interface CountdownClockProps {
  eventDate: string;
  eventTime: string;
  eventTitle: string;
  eventLocation?: string;
  className?: string;
  showEventDetails?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownClock({ 
  eventDate, 
  eventTime, 
  eventTitle, 
  eventLocation,
  className = '',
  showEventDetails = true 
}: CountdownClockProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Parse the event date and time
      const eventDateTime = new Date(`${eventDate} ${eventTime}`);
      const now = new Date();
      const difference = eventDateTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventTime]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-red-400 mr-2" />
            <h3 className="text-lg font-semibold text-red-300">Event Has Started!</h3>
          </div>
          {showEventDetails && (
            <div className="text-red-200/80">
              <p className="font-medium">{eventTitle}</p>
              <p className="text-sm">{formatDate(eventDate)} at {formatTime(eventTime)}</p>
              {eventLocation && (
                <p className="text-sm flex items-center justify-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {eventLocation}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6"
      >
        {showEventDetails && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{eventTitle}</h3>
            <div className="flex items-center justify-center text-white/80 text-sm space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(eventDate)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(eventTime)}
              </div>
              {eventLocation && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {eventLocation}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {/* Days */}
          <motion.div
            key={timeLeft.days}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-xs text-white/70 uppercase tracking-wide">Days</div>
          </motion.div>

          {/* Hours */}
          <motion.div
            key={timeLeft.hours}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-xs text-white/70 uppercase tracking-wide">Hours</div>
          </motion.div>

          {/* Minutes */}
          <motion.div
            key={timeLeft.minutes}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-xs text-white/70 uppercase tracking-wide">Minutes</div>
          </motion.div>

          {/* Seconds */}
          <motion.div
            key={timeLeft.seconds}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20"
          >
            <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-xs text-white/70 uppercase tracking-wide">Seconds</div>
          </motion.div>
        </div>

        <div className="mt-4 text-white/60 text-sm">
          Until the event begins
        </div>
      </motion.div>
    </div>
  );
}
