import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, Linkedin, Quote, X, Calendar, MapPin, GraduationCap } from 'lucide-react';
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
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  // TODO: Remove mock data when implementing real staff data
  const staff = [
    {
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
    },
    {
      id: 'pastor-sarah',
      name: 'Sarah Williams',
      title: 'Associate Pastor',
      image: pastorImage, // TODO: Replace with actual image
      bio: 'Pastor Sarah joined our team 5 years ago and leads our youth and family ministries. She brings energy and creativity to help families grow in faith together.',
      email: 'swilliams@unitedbethel.org',
      phone: '(555) 123-4568',
      quote: 'I believe every child and teenager has incredible potential in God\'s kingdom.',
      specialties: ['Youth Ministry', 'Family Programs', 'Children\'s Ministry'],
      education: 'Master of Arts in Christian Education, Bible College',
      experience: '8+ years in youth and family ministry',
      additionalInfo: 'Pastor Sarah has a heart for creating engaging and meaningful experiences for young people and their families. She has developed innovative programs that connect faith with real-life challenges.',
      officeHours: 'Tuesday-Thursday: 10:00 AM - 6:00 PM',
      officeLocation: 'Youth Wing, Second Floor'
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
                        {(person.id === 'pastor-johnson' || person.id === 'pastor-sarah') && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            data-testid={`button-learn-more-${person.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDialogOpen(person.id);
                            }}
                          >
                            Learn More
                          </Button>
                        )}
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
        </motion.div>

        {/* Meet Our Pastor Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              Meet Our <span className="text-primary">Pastor</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get to know our Senior Pastor who leads our congregation with wisdom, compassion, and dedication.
            </p>
          </div>

          <div className="max-w-8xl mx-auto">
            <Card className="overflow-hidden hover-elevate transition-all duration-300">
              <div className="flex flex-col">
                {/* Pastor Image */}
                <div className="relative">
                  <img
                    src={staff[0].image}
                    alt={staff[0].name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Pastor Info */}
                <div className="p-8 text-left">
                  <div className="mb-6">
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mb-2">
                      {staff[0].name}
                    </h3>
                    <p className="text-primary text-lg font-medium mb-4">
                      {staff[0].title}
                    </p>
                    <Quote className="h-6 w-6 text-primary mb-3" />
                    <p className="text-muted-foreground italic text-lg leading-relaxed">
                      "{staff[0].quote}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {staff[0].bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {staff[0].specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => setDialogOpen('pastor-johnson')}
                    >
                      Learn More
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => console.log(`Email ${staff[0].name}: ${staff[0].email}`)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Staff Detail Dialog */}
      {dialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDialogOpen(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const person = staff.find(p => p.id === dialogOpen);
              if (!person || !('education' in person)) return null;
              
              return (
                <>
                  {/* Header */}
                  <div className="relative">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-64 object-cover rounded-t-2xl"
                    />
                    <button
                      onClick={() => setDialogOpen(null)}
                      className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <h2 className="text-2xl font-serif font-bold text-white mb-1">
                        {person.name}
                      </h2>
                      <p className="text-white/90 text-lg">
                        {person.title}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Quote */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Quote className="h-5 w-5 text-gray-600 mb-2" />
                      <p className="text-gray-700 italic">
                        "{person.quote}"
                      </p>
                    </div>

                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {person.bio}
                      </p>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Background</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {person.additionalInfo}
                      </p>
                    </div>

                    {/* Education & Experience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <GraduationCap className="h-5 w-5 text-gray-600 mr-2" />
                          <h4 className="font-semibold text-gray-900">Education</h4>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {person.education}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                          <h4 className="font-semibold text-gray-900">Experience</h4>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {person.experience}
                        </p>
                      </div>
                    </div>

                    {/* Office Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                          <h4 className="font-semibold text-gray-900">Office Hours</h4>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {person.officeHours}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                          <h4 className="font-semibold text-gray-900">Office Location</h4>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {person.officeLocation}
                        </p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {person.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          console.log(`Email ${person.name}: ${person.email}`);
                          setDialogOpen(null);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          console.log(`Call ${person.name}: ${person.phone}`);
                          setDialogOpen(null);
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}