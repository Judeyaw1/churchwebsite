import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Phone, Quote, GraduationCap, X, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import pastorImage from '@assets/generated_images/pastor_mark_asiedu_frimpong.svg';

interface PastorSectionProps {
  className?: string;
}

export default function PastorSection({ className = '' }: PastorSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pastor = {
    name: 'Rev. Mark Asiedu Frimpong',
    title: 'Senior Pastor',
    image: pastorImage,
    bio: 'Rev. Mark Asiedu Frimpong is a dedicated servant of God with over 15 years of pastoral experience. Born and baptized in the Presbyterian Church, he began his personal walk with God during college and has since served faithfully in ministry.',
    email: 'pastor@unitedbethelpresbyterian.com',
    phone: '(301) 339-3258',
    quote: 'My heart is to see every person discover God\'s love and purpose for their life.',
    education: 'Master of Divinity, Louisville Presbyterian Theological Seminary',
    fullBio: `"When Jesus says, 'Yes,' no one can say, 'No.'"

The powerful truth in this well-known song resonates deeply with the heart of our pastor, Rev. Mark Asiedu Frimpong, a man who has continually witnessed the unfolding work of the Lord in ministering to His children. As he often proclaims, "The Lord takes the natural and adds His super to make it supernatural." Indeed, Rev. Asiedu Frimpong's life is a true reflection of this divine principle.

Born and baptized in the Presbyterian Church, Pastor Frimpong began his personal walk with God during his third year in college—a transformative experience he describes as a "Pauline call" into ministry. He initially served in the Baptist Church for several years before feeling led back to his Presbyterian roots.

In 1994, during the Nanumba–Konkomba conflict in the Northern Region of Ghana, his unwavering faith and bold spirit led him to serve courageously in the midst of danger. It was during this time that he planted his first non-denominational church in Zabzugu Tatale, demonstrating his deep commitment to God's mission even under perilous conditions.

Pastor Frimpong is a proud graduate of Abuakwa State College, Akyem Kibi, and the Kwame Nkrumah University of Science and Technology (KNUST), where he earned a B.S. in Animal Production (1990–1994). He also holds a Postgraduate Diploma in Education (1998–1999) from the University of Cape Coast.

As an educator, he taught science at Abuakwa State College, Praso Kuma Middle School, Mfantsiman Girls' Secondary School, and Langley High School in Virginia. From 1997 to 1999, he served as Head of the Agricultural Science Department at Mfantsiman Girls' Secondary School.

Answering his call to ministry, Rev. Frimpong served in numerous leadership roles within the Presbyterian Church of Ghana in the Central Region, including Local Preacher, Financial Committee Chairman, Christian Education Director, and Evangelism & Lay Training Committee Chairman.

On May 4, 2008, Rev. Frimpong was ordained by the National Capital Presbytery of PC(USA) as a Minister of Word and Sacrament. He served as Pastor of the Ghanaian Presbyterian Church in Maryland (later renamed Christ the King) until March 2014, when he received a divine call to plant a new church. This led to the founding of United Bethel Presbyterian Church, where he continues to serve faithfully as a humble, prayerful, and dynamic preacher—anointed with wisdom, humor, and a deep love for God's people.

Rev. Frimpong is known for his principled and disciplined life, guided by firm convictions and an unshakable passion for ministry.

He is blessed with a loving wife, Mrs. Juliana Asiedu Frimpong, and together they share the joy of parenting their son, Emmanuel Asiedu Frimpong.`,
    specialties: ['Biblical Teaching', 'Pastoral Care', 'Leadership Development', 'Community Outreach'],
    experience: '15+ years in pastoral ministry',
    officeHours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    officeLocation: 'Main Office, First Floor'
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 flex-1"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 flex-1"
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

        {/* Full Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-white text-center">
                {pastor.name} - {pastor.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Pastor Image */}
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20">
                  <img
                    src={pastor.image}
                    alt={pastor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Quote */}
              <div className="text-center">
                <Quote className="h-8 w-8 text-white/60 mx-auto mb-3" />
                <p className="text-white/90 italic text-lg leading-relaxed">
                  "{pastor.quote}"
                </p>
              </div>

              {/* Full Bio */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Biography</h3>
                <div className="prose prose-invert max-w-none">
                  {pastor.fullBio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-white/80 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </h3>
                  <p className="text-white/80">{pastor.education}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Experience
                  </h3>
                  <p className="text-white/80">{pastor.experience}</p>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Ministry Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {pastor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-white/10 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Office Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Office Hours
                  </h3>
                  <p className="text-white/80">{pastor.officeHours}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Office Location
                  </h3>
                  <p className="text-white/80">{pastor.officeLocation}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-white/70 mr-3" />
                    <a 
                      href={`mailto:${pastor.email}`}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {pastor.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-white/70 mr-3" />
                    <a 
                      href={`tel:${pastor.phone}`}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {pastor.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}