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
    id: 'pastor-johnson',
    name: 'Rev. Michael Johnson',
    title: 'Senior Pastor',
    image: pastorImage,
    bio: 'Pastor Michael has been leading our congregation for over 15 years. He holds a Master of Divinity from Seminary and is passionate about biblical teaching and community outreach.',
    email: 'mjohnson@unitedbethel.org',
    phone: '(555) 123-4567',
    quote: 'My heart is to see every person discover God\'s love and purpose for their life.',
    specialties: ['Biblical Teaching', 'Pastoral Care', 'Leadership Development'],
    education: 'Master of Divinity, Seminary University',
    experience: '15+ years in pastoral ministry',
    additionalInfo: 'Pastor Michael is passionate about building authentic Christian community and helping individuals discover their God-given purpose. He has led numerous mission trips and community outreach programs.',
    officeHours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    officeLocation: 'Main Office, First Floor'
  };

  return (
    <section ref={ref} className={`py-20 bg-black/95 ${className}`} id="pastor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
            Meet Our <span className="text-white">Pastor</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Get to know our Senior Pastor who leads our congregation with wisdom, compassion, and dedication.
          </p>
        </motion.div>

        {/* Pastor Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="overflow-hidden bg-white/5 border-white/20 hover-elevate transition-all duration-300">
            <div className="flex flex-col lg:flex-row">
              {/* Pastor Image */}
              <div className="lg:w-1/2">
                <div className="aspect-[4/5] lg:aspect-square overflow-hidden">
                  <img
                    src={pastor.image}
                    alt={pastor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Pastor Information */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="h-full flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
                      {pastor.name}
                    </h3>
                    <p className="text-lg text-white/70 mb-4">{pastor.title}</p>
                    <div className="flex items-center mb-4">
                      <GraduationCap className="h-5 w-5 text-white/60 mr-2" />
                      <span className="text-white/80 text-sm">{pastor.education}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-white/80 leading-relaxed mb-4">
                      {pastor.bio}
                    </p>
                    <p className="text-white/80 leading-relaxed">
                      {pastor.additionalInfo}
                    </p>
                  </div>

                  {/* Quote */}
                  <div className="mb-6 p-4 bg-white/5 rounded-lg border-l-4 border-white/30">
                    <Quote className="h-6 w-6 text-white/60 mb-2" />
                    <p className="text-white/90 italic font-medium">
                      "{pastor.quote}"
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Areas of Focus</h4>
                    <div className="flex flex-wrap gap-2">
                      {pastor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-white/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-white/60 mr-3" />
                        <a
                          href={`mailto:${pastor.email}`}
                          className="text-white/80 hover:text-white transition-colors duration-200"
                        >
                          {pastor.email}
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-white/60 mr-3" />
                        <a
                          href={`tel:${pastor.phone}`}
                          className="text-white/80 hover:text-white transition-colors duration-200"
                        >
                          {pastor.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="text-white/60 text-sm">
                    <p><strong>Office Hours:</strong> {pastor.officeHours}</p>
                    <p><strong>Location:</strong> {pastor.officeLocation}</p>
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
