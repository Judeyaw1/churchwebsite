import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Clock, MapPin, Calendar, Users, Music, Baby, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServicesSectionProps {
  className?: string;
}

export default function ServicesSection({ className = '' }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: 'sunday-worship',
      title: 'Sunday Worship',
      time: '9:00 AM & 11:00 AM',
      description: 'Join us for inspiring worship, biblical teaching, and community fellowship.',
      icon: Music,
      details: 'Our Sunday services include contemporary worship music, practical biblical teaching, and time for community connection. Childcare is available for all ages.'
    },
    {
      id: 'bible-study',
      title: 'Midweek Bible Study',
      time: 'Wednesdays 7:00 PM',
      description: 'Dive deeper into God\'s word with interactive study and discussion.',
      icon: GraduationCap,
      details: 'Interactive Bible study sessions where we explore Scripture together, ask questions, and grow in our understanding of God\'s word.'
    },
    {
      id: 'youth-group',
      title: 'Youth Ministry',
      time: 'Fridays 6:30 PM',
      description: 'Fun, faith-building activities for teens and young adults.',
      icon: Users,
      details: 'Age-appropriate programming for teens including games, worship, biblical teaching, and community service opportunities.'
    },
    {
      id: 'kids-ministry',
      title: 'Children\'s Ministry',
      time: 'Sundays during service',
      description: 'Engaging programs for children of all ages during worship.',
      icon: Baby,
      details: 'Safe, fun, and educational programs designed to help children learn about God\'s love through stories, games, and activities.'
    }
  ];

  const upcomingEvents = [
    {
      date: 'Dec 15',
      title: 'Christmas Concert',
      time: '7:00 PM',
      type: 'Special Event'
    },
    {
      date: 'Dec 22',
      title: 'Family Service',
      time: '10:00 AM',
      type: 'Worship Service'
    },
    {
      date: 'Dec 24',
      title: 'Christmas Eve Service',
      time: '6:00 PM & 8:00 PM',
      type: 'Special Service'
    },
    {
      date: 'Jan 5',
      title: 'New Members Class',
      time: '12:30 PM',
      type: 'Membership'
    }
  ];

  return (
    <section ref={ref} className={`py-20 bg-card ${className}`} id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
            Services & <span className="text-primary">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We offer various ways to connect with God and our community throughout the week. 
            Find the right fit for you and your family.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className={`hover-elevate transition-all duration-300 cursor-pointer border-2 ${
                      selectedService === service.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-card-border hover:border-primary/20'
                    }`}
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                    data-testid={`card-service-${service.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <service.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">
                        {service.description}
                      </p>
                      
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: selectedService === service.id ? 'auto' : 0,
                          opacity: selectedService === service.id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {service.details}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            data-testid={`button-learn-more-${service.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Learn more about ${service.title}`);
                            }}
                          >
                            Learn More
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="bg-background rounded-lg p-4 hover-elevate transition-all duration-300"
                    data-testid={`event-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time}
                        </div>
                        <span className="inline-block bg-accent/10 text-accent px-2 py-1 rounded text-xs mt-2">
                          {event.type}
                        </span>
                      </div>
                      <div className="text-center ml-4">
                        <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium">
                          {event.date}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  data-testid="button-view-all-events"
                  onClick={() => console.log('View all events clicked')}
                >
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}