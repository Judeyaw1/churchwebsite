import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Users, Book, Globe } from 'lucide-react';
import communityImage from '@assets/generated_images/Church_community_fellowship_gathering_6de85642.png';

interface AboutSectionProps {
  className?: string;
}

export default function AboutSection({ className = '' }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const values = [
    {
      icon: Heart,
      title: 'Love & Compassion',
      description: 'We believe in showing Christ\'s love through our actions and words to everyone we meet.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong relationships and supporting one another through life\'s journey together.'
    },
    {
      icon: Book,
      title: 'Biblical Teaching',
      description: 'Grounded in Scripture, we seek to understand and apply God\'s word in our daily lives.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Making a difference locally and globally through missions and service opportunities.'
    }
  ];

  return (
    <section ref={ref} className={`py-20 bg-background ${className}`} id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
                Our <span className="text-primary">Mission</span> & Values
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                For over 30 years, Grace Community Church has been a beacon of hope and faith in our neighborhood. 
                We're more than just a place of worship—we're a family united by our love for Christ and our 
                commitment to serving others.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our doors are open to everyone, regardless of where you are in your faith journey. Whether you're 
                taking your first steps or have been walking with Christ for years, you'll find a welcoming home here.
              </p>
            </motion.div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-card rounded-lg p-6 hover-elevate transition-all duration-300 border border-card-border">
                    <div className="flex items-center mb-3">
                      <div className="bg-accent/10 p-2 rounded-lg mr-3 group-hover:bg-accent/20 transition-colors duration-300">
                        <value.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground">{value.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={communityImage}
                alt="Church community fellowship"
                className="w-full h-[600px] object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-card rounded-xl shadow-xl p-6 border border-card-border"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">30+</div>
                  <div className="text-xs text-muted-foreground">Years Serving</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground">Families</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}