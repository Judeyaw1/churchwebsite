import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface CompactCountdownProps {
  eventDate: string;
  eventTime: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CompactCountdown({ 
  eventDate, 
  eventTime, 
  className = ''
}: CompactCountdownProps) {
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

  if (isExpired) {
    return (
      <div className={`inline-flex items-center px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg ${className}`}>
        <Clock className="h-4 w-4 text-red-400 mr-2" />
        <span className="text-red-300 text-sm font-medium">Event Started</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg ${className}`}>
      <Clock className="h-4 w-4 text-blue-400 mr-2" />
      <div className="flex items-center space-x-2 text-sm text-blue-300">
        {timeLeft.days > 0 && (
          <span className="font-medium">{timeLeft.days}d</span>
        )}
        <span className="font-medium">{timeLeft.hours}h</span>
        <span className="font-medium">{timeLeft.minutes}m</span>
        <span className="font-medium">{timeLeft.seconds}s</span>
      </div>
    </div>
  );
}
