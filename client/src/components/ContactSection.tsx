import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactSectionProps {
  className?: string;
}

export default function ContactSection({ className = '' }: ContactSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['9045 Maier Road', 'Laurel, MD 20723'],
      action: 'Get Directions'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['Main: (555) 123-4567', 'Prayer: (555) 123-PRAY'],
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['unitedbethelpresbyterian', '@gmail.com'],
      action: 'Send Email'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon-Fri: 9:00 AM - 5:00 PM', 'Sat-Sun: By Appointment'],
      action: 'Schedule Visit'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Remove mock functionality - implement real form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section ref={ref} className={`py-20 bg-black/95 ${className}`} id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 sm:mb-6">
            Get in <span className="text-white">Touch</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you have questions, need prayer, or want to get involved, 
            we're here to help and connect with you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover-elevate transition-all duration-300 bg-white/5 border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-white/10 p-3 rounded-lg mr-4 flex-shrink-0">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-white/80 text-sm mb-1">
                            {detail}
                          </p>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 p-0 h-auto text-white hover:text-white/80"
                          data-testid={`button-${info.title.toLowerCase().replace(' ', '-')}`}
                          onClick={() => {
                            if (info.title === 'Visit Us') {
                              window.open('https://maps.google.com/?q=9045+Maier+Road,+Laurel,+MD+20723', '_blank');
                            } else if (info.title === 'Call Us') {
                              window.location.href = 'tel:+15551234567';
                            } else if (info.title === 'Email Us') {
                              window.location.href = 'mailto:unitedbethelpresbyterian@gmail.com';
                            } else {
                              console.log(`${info.action} clicked`);
                            }
                          }}
                        >
                          {info.action} →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Interactive Google Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="overflow-hidden hover-elevate transition-all duration-300 bg-white/5 border-white/20">
                <div className="h-64">
                  <iframe
                    src="https://www.google.com/maps?q=9045+Maier+Road,+Laurel,+MD+20723&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title="United Bethel Presbyterian Church Location"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/80">9045 Maier Road, Laurel, MD</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/10"
                      data-testid="button-view-map"
                      onClick={() => window.open('https://maps.google.com/?q=9045+Maier+Road,+Laurel,+MD+20723', '_blank')}
                    >
                      Open in Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                        data-testid="input-name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        data-testid="input-email"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        data-testid="input-phone"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Subject</Label>
                      <Select 
                        value={formData.subject} 
                        onValueChange={(value) => handleInputChange('subject', value)}
                      >
                        <SelectTrigger data-testid="select-subject" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="What's this about?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="prayer">Prayer Request</SelectItem>
                          <SelectItem value="visit">Planning a Visit</SelectItem>
                          <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                          <SelectItem value="pastoral">Pastoral Care</SelectItem>
                          <SelectItem value="events">Events & Programs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">Your Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us how we can help you or what's on your heart..."
                      className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      required
                      data-testid="textarea-message"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <p className="text-sm text-white/80">
                      We typically respond within 24 hours.
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-black hover:bg-black/90 w-full sm:w-auto"
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="font-medium text-white mb-4">Need immediate help?</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white/10 hover:text-white"
                      data-testid="button-emergency-prayer"
                      onClick={() => console.log('Emergency prayer request')}
                    >
                      Emergency Prayer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white/10 hover:text-white"
                      data-testid="button-schedule-meeting"
                      onClick={() => console.log('Schedule pastoral meeting')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white/10 hover:text-white"
                      data-testid="button-live-chat"
                      onClick={() => console.log('Start live chat')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}