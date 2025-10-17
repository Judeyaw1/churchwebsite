import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef } from 'react';
import heroImage from '@assets/generated_images/Modern_church_exterior_building_046c51f8.png';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={heroImage}
          muted={isMuted}
          loop
          playsInline
          autoPlay
          onError={() => {
            console.log('Video failed to load, using fallback image');
          }}
        >
          <source src="https://www.pexels.com/download/video/5949379/" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img 
            src={heroImage} 
            alt="United Bethel Presbyterian Church exterior"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      {/* Video Controls - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-4">
        <button
          onClick={togglePlayPause}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 rounded-full p-3 border border-white/20"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 rounded-full p-3 border border-white/20"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full pl-4 sm:pl-6 lg:pl-8 pr-4 text-left text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-left">
            Welcome to{' '}
            <span className="text-white">United Bethel 
              <br /> Presbyterian</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl leading-relaxed text-left">
            A place where faith meets community, and hearts find home. 
            Join us for worship, fellowship, and spiritual growth.
          </p>
        </motion.div>

        {/* Service Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center mb-3">
              <Clock className="h-6 w-6 text-white mr-2" />
              <span className="font-semibold">Service Times</span>
            </div>
            <p className="text-white/90">
              Sundays 9:00 AM & 11:00 AM
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center mb-3">
              <MapPin className="h-6 w-6 text-white mr-2" />
              <span className="font-semibold">Location</span>
            </div>
            <p className="text-white/90">
              123 Community Drive<br />Springfield, ST 12345
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center mb-3">
              <Calendar className="h-6 w-6 text-white mr-2" />
              <span className="font-semibold">This Week</span>
            </div>
            <p className="text-white/90">
              Wed Bible Study 7:00 PM<br />Fri Youth Group 6:30 PM
            </p>
          </div>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-start items-start"
        >
          <Button
            size="lg"
            className="bg-white hover:bg-black/90 hover:text-white text-black font-semibold px-8 py-3 text-lg"
            data-testid="button-plan-visit"
            onClick={() => console.log('Plan Your Visit clicked')}
          >
            Get In Touch
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-md border-black/30 text-white hover:bg-black/20 font-semibold px-8 py-3 text-lg"
            data-testid="button-watch-online"
            onClick={() => console.log('Watch Online clicked')}
          >
            Watch Online
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}