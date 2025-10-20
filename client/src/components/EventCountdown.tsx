import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

interface EventCountdownProps {
  eventDate: string;
  eventTime: string;
  eventTitle: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function EventCountdown({ 
  eventDate, 
  eventTime, 
  eventTitle,
  className = ''
}: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

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
        
        // Show countdown if 2 days or less remaining (temporarily always show for testing)
        setShowCountdown(true);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        setShowCountdown(false);
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
      <div className={`bg-red-800 rounded-lg p-4 shadow-lg ${className}`}>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Event Started
          </div>
          <div className="text-xs text-red-300 uppercase tracking-wide">
            Event in Progress
          </div>
        </div>
      </div>
    );
  }

  if (!showCountdown) {
    return (
      <div className={`bg-purple-800 rounded-lg p-4 sm:p-10 md:p-12 shadow-lg w-full sm:w-auto ${className}`}>
        <div className="text-center">
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 break-words whitespace-normal leading-tight">
            Coming Soon
          </div>
          <div className="text-sm sm:text-lg md:text-xl text-purple-200 uppercase tracking-wide">
            Event Scheduled
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 sm:p-8 shadow-lg ${className}`}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-12">
        {timeLeft.days > 0 && (
          <>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wide">
                Days
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 sm:h-16 bg-gray-600"></div>
          </>
        )}
        
        <div className="text-center">
          <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wide">
            Hours
          </div>
        </div>
        
        <div className="hidden sm:block w-px h-10 sm:h-16 bg-gray-600"></div>
        
        <div className="text-center">
          <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wide">
            Minutes
          </div>
        </div>
        
        <div className="hidden sm:block w-px h-10 sm:h-16 bg-gray-600"></div>
        
        <div className="text-center">
          <div className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-gray-400 uppercase tracking-wide">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
