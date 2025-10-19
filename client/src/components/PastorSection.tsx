import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Phone, Quote, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import pastorImage from '@assets/generated_images/Church_pastor_professional_headshot_1618d5ab.png';

interface PastorSectionProps {
  className?: string;
}

export default function PastorSection({ className = '' }: PastorSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const pastor = {
    name: 'Rev. Mark Asiedu Frimpong',
    title: 'Senior Pastor',
    image: pastorImage,
    bio: 'Rev. Mark Asiedu Frimpong is a dedicated servant of God with over 15 years of pastoral experience. Born and baptized in the Presbyterian Church, he began his personal walk with God during college and has since served faithfully in ministry.',
    email: 'pastor@unitedbethelpresbyterian.com',
    phone: '(301) 339-3258',
    quote: 'My heart is to see every person discover God\'s love and purpose for their life.',
    education: 'Master of Divinity, Louisville Presbyterian Theological Seminary'
  };

  return (
    <section ref={ref} className={`py-16 sm:py-20 bg-black/95 ${className}`} id="pastor">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Meet Our <span className="text-white">Pastor</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Get to know our Senior Pastor who leads our congregation with wisdom and compassion.
          </p>
        </motion.div>

        {/* Pastor Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-white/5 border-white/20 hover-elevate transition-all duration-300">
            <div className="flex flex-col lg:flex-row">
              {/* Pastor Image */}
              <div className="lg:w-2/5">
                <div className="aspect-[4/5] lg:aspect-square overflow-hidden">
                  <img
                    src={pastor.image}
                    alt={pastor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Pastor Information */}
              <div className="lg:w-3/5 p-6 sm:p-8">
                <div className="h-full flex flex-col justify-center">
                  {/* Name and Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                      {pastor.name}
                    </h3>
                    <p className="text-lg text-white/80 font-medium">
                      {pastor.title}
                    </p>
                  </div>

                  {/* Quote */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <Quote className="h-6 w-6 text-white/60 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-white/90 italic text-lg leading-relaxed">
                        "{pastor.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <p className="text-white/80 leading-relaxed">
                      {pastor.bio}
                    </p>
                  </div>

                  {/* Education */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <GraduationCap className="h-5 w-5 text-white/70 mr-2" />
                      <span className="text-white font-medium">Education</span>
                    </div>
                    <p className="text-white/80 text-sm">
                      {pastor.education}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-white/70 mr-2" />
                        <a 
                          href={`mailto:${pastor.email}`}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          {pastor.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-white/70 mr-2" />
                        <a 
                          href={`tel:${pastor.phone}`}
                          className="text-white/80 hover:text-white transition-colors"
                        >
                          {pastor.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <div>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Pastor
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}