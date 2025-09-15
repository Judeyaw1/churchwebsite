import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, Linkedin, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import pastorImage from '@assets/generated_images/Church_pastor_professional_headshot_1618d5ab.png';

interface StaffSectionProps {
  className?: string;
}

export default function StaffSection({ className = '' }: StaffSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  // TODO: Remove mock data when implementing real staff data
  const staff = [
    {
      id: 'pastor-johnson',
      name: 'Rev. Michael Johnson',
      title: 'Senior Pastor',
      image: pastorImage,
      bio: 'Pastor Michael has been leading our congregation for over 15 years. He holds a Master of Divinity from Seminary and is passionate about biblical teaching and community outreach.',
      email: 'mjohnson@gracecommunity.org',
      phone: '(555) 123-4567',
      quote: 'My heart is to see every person discover God\'s love and purpose for their life.',
      specialties: ['Biblical Teaching', 'Pastoral Care', 'Leadership Development']
    },
    {
      id: 'pastor-sarah',
      name: 'Sarah Williams',
      title: 'Associate Pastor',
      image: pastorImage, // TODO: Replace with actual image
      bio: 'Pastor Sarah joined our team 5 years ago and leads our youth and family ministries. She brings energy and creativity to help families grow in faith together.',
      email: 'swilliams@gracecommunity.org',
      phone: '(555) 123-4568',
      quote: 'I believe every child and teenager has incredible potential in God\'s kingdom.',
      specialties: ['Youth Ministry', 'Family Programs', 'Children\'s Ministry']
    },
    {
      id: 'david-chen',
      name: 'David Chen',
      title: 'Worship Director',
      image: pastorImage, // TODO: Replace with actual image
      bio: 'David leads our worship team and has been with us for 8 years. He\'s a talented musician who helps create meaningful worship experiences every Sunday.',
      email: 'dchen@gracecommunity.org',
      phone: '(555) 123-4569',
      quote: 'Worship is where heaven meets earth, and we get to be part of that beautiful moment.',
      specialties: ['Music Ministry', 'Audio/Visual', 'Creative Arts']
    },
    {
      id: 'maria-gonzalez',
      name: 'Maria Gonzalez',
      title: 'Community Outreach Coordinator',
      image: pastorImage, // TODO: Replace with actual image
      bio: 'Maria coordinates our community service initiatives and missions programs. Her heart for service has helped us make a real impact in our neighborhood.',
      email: 'mgonzalez@gracecommunity.org',
      phone: '(555) 123-4570',
      quote: 'When we serve others, we serve Christ himself.',
      specialties: ['Community Service', 'Missions', 'Social Justice']
    }
  ];

  return (
    <section ref={ref} className={`py-20 bg-background ${className}`} id="staff">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
            Meet Our <span className="text-primary">Team</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our dedicated team is here to serve you and help you grow in your faith journey. 
            Each member brings unique gifts and passion for ministry.
          </p>
        </motion.div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staff.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className="hover-elevate transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => setSelectedStaff(selectedStaff === person.id ? null : person.id)}
                data-testid={`card-staff-${person.id}`}
              >
                <div className="relative">
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Quote Overlay */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: selectedStaff === person.id ? 1 : 0,
                      y: selectedStaff === person.id ? 0 : 20
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-primary/95 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-none"
                  >
                    <div className="text-center text-primary-foreground">
                      <Quote className="h-6 w-6 mx-auto mb-2 opacity-60" />
                      <p className="text-sm italic leading-relaxed">
                        "{person.quote}"
                      </p>
                    </div>
                  </motion.div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {person.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {person.title}
                  </p>
                  
                  {/* Expanded Content */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: selectedStaff === person.id ? 'auto' : 0,
                      opacity: selectedStaff === person.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border pt-4 space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {person.bio}
                      </p>
                      
                      {/* Specialties */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {person.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="bg-accent/10 text-accent px-2 py-1 rounded text-xs"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          data-testid={`button-email-${person.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Email ${person.name}: ${person.email}`);
                          }}
                        >
                          <Mail className="h-3 w-3 mr-2" />
                          Send Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          data-testid={`button-call-${person.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(`Call ${person.name}: ${person.phone}`);
                          }}
                        >
                          <Phone className="h-3 w-3 mr-2" />
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Click to expand hint */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: selectedStaff === person.id ? 0 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-center"
                  >
                    <span className="text-xs text-muted-foreground">
                      Click to learn more
                    </span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-card rounded-2xl p-8 border border-card-border max-w-4xl mx-auto">
            <h3 className="text-xl font-serif font-semibold text-foreground mb-4">
              Ready to Connect?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Whether you have questions about faith, need prayer, or want to get involved, 
              our team is here for you. Don't hesitate to reach out!
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90"
              data-testid="button-contact-team"
              onClick={() => console.log('Contact team clicked')}
            >
              Contact Our Team
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}