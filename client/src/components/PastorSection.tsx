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
    id: 'pastor-Mark',
    name: 'Rev. Mark Asiedu Frimpong',
    title: 'Senior Pastor',
    image: pastorImage,
    bio: `"When Jesus says, 'Yes,' no one can say, 'No.'"

The powerful truth in this well-known song resonates deeply with the heart of our pastor, Rev. Mark Asiedu Frimpong, a man who has continually witnessed the unfolding work of the Lord in ministering to His children. As he often proclaims, "The Lord takes the natural and adds His super to make it supernatural." Indeed, Rev. Asiedu Frimpong's life is a true reflection of this divine principle.

Born and baptized in the Presbyterian Church, Pastor Frimpong began his personal walk with God during his third year in college—a transformative experience he describes as a "Pauline call" into ministry. He initially served in the Baptist Church for several years before feeling led back to his Presbyterian roots.

In 1994, during the Nanumba–Konkomba conflict in the Northern Region of Ghana, his unwavering faith and bold spirit led him to serve courageously in the midst of danger. It was during this time that he planted his first non-denominational church in Zabzugu Tatale, demonstrating his deep commitment to God's mission even under perilous conditions.

Pastor Frimpong is a proud graduate of Abuakwa State College, Akyem Kibi, and the Kwame Nkrumah University of Science and Technology (KNUST), where he earned a B.S. in Animal Production (1990–1994). He also holds a Postgraduate Diploma in Education (1998–1999) from the University of Cape Coast.

As an educator, he taught science at Abuakwa State College, Praso Kuma Middle School, Mfantsiman Girls' Secondary School, and Langley High School in Virginia. From 1997 to 1999, he served as Head of the Agricultural Science Department at Mfantsiman Girls' Secondary School. In 1998, he also served as the District Subject Matter Specialist in Animal Production for the Ghana Ministry of Food and Agriculture.

Answering his call to ministry, Rev. Frimpong served in numerous leadership roles within the Presbyterian Church of Ghana in the Central Region, including Local Preacher, Financial Committee Chairman, Christian Education Director, and Evangelism & Lay Training Committee Chairman. His dedication later earned him the roles of Assistant District Secretary for Bible Studies and Prayer Group, and District Church Planting and Evangelism Coordinator for the Cape Coast District.

From 1997 to 1999, he also served as Patron for a combined group of nearly 1,000 members of the Ghana Methodist Students Union and National Union of Presbyterian Students.

His zeal for evangelism inspired him and fellow teachers to form the Mfantsiman Staff Christian Fellowship and its Kitchen Ministry, an outreach program that brought the Word of God to teachers and staff who were unable to attend regular Sunday services due to work obligations.

Although he was nominated by the Western Presbytery to begin seminary training in Ghana in 1999, Rev. Frimpong migrated to the United States, where he continued his dual journey as a teacher and servant of God. He worked as a Biology Instructor and Pharmacy Technician, while serving as an Ordained Elder for Evangelism and Mission in the Presbyterian Church (USA) in 2000, and later as Lay Leader of the Ghanaian Presbyterian Church in Maryland (2000–2004). He eventually pursued formal theological studies at the Louisville Presbyterian Theological Seminary, earning his Master of Divinity degree.

On May 4, 2008, Rev. Frimpong was ordained by the National Capital Presbytery of PC(USA) as a Minister of Word and Sacrament. He served as Pastor of the Ghanaian Presbyterian Church in Maryland (later renamed Christ the King) until March 2014, when he received a divine call to plant a new church. This led to the founding of United Bethel Presbyterian Church, where he continues to serve faithfully as a humble, prayerful, and dynamic preacher—anointed with wisdom, humor, and a deep love for God's people.

Rev. Frimpong is known for his principled and disciplined life, guided by firm convictions and an unshakable passion for ministry.

He is blessed with a loving wife, Mrs. Juliana Asiedu Frimpong, and together they share the joy of parenting their son, Emmanuel Asiedu Frimpong.`,
    email: 'pastor@unitedbethelpresbyterian.com',
    phone: '(301) 339-3258',
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
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 sm:mb-6">
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
              <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12">
                <div className="h-full flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-white mb-2">
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
