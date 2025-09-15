import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import heroImage from '@assets/generated_images/Modern_church_exterior_building_046c51f8.png';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Grace Community Church exterior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to{' '}
            <span className="text-accent">Grace Community</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            A place where faith meets community, and hearts find home. 
            Join us for worship, fellowship, and spiritual growth.
          </p>
        </motion.div>

        {/* Service Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-accent mr-2" />
              <span className="font-semibold">Service Times</span>
            </div>
            <p className="text-white/90">
              Sundays 9:00 AM & 11:00 AM
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <MapPin className="h-6 w-6 text-accent mr-2" />
              <span className="font-semibold">Location</span>
            </div>
            <p className="text-white/90">
              123 Community Drive<br />Springfield, ST 12345
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-accent mr-2" />
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
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3 text-lg"
            data-testid="button-plan-visit"
            onClick={() => console.log('Plan Your Visit clicked')}
          >
            Plan Your Visit
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-3 text-lg"
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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