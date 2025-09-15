import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Visit Us',
      items: [
        { icon: MapPin, text: '123 Community Drive' },
        { text: 'Springfield, ST 12345' },
        { icon: Phone, text: '(555) 123-4567' },
        { icon: Mail, text: 'info@gracecommunity.org' }
      ]
    },
    {
      title: 'Service Times',
      items: [
        { icon: Clock, text: 'Sunday Worship' },
        { text: '9:00 AM & 11:00 AM' },
        { text: 'Wednesday Bible Study' },
        { text: '7:00 PM' }
      ]
    },
    {
      title: 'Quick Links',
      items: [
        { text: 'About Us', href: '#about' },
        { text: 'Our Services', href: '#services' },
        { text: 'Events', href: '#events' },
        { text: 'Meet Our Staff', href: '#staff' },
        { text: 'Contact Us', href: '#contact' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ];

  return (
    <footer className={`bg-primary text-primary-foreground ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="font-serif text-2xl font-bold mb-4">Grace Community</h3>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              A place where faith meets community, and hearts find home. Join us for worship, 
              fellowship, and spiritual growth.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                  onClick={() => console.log(`Visit ${social.label}`)}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
            >
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-center text-primary-foreground/80">
                    {'icon' in item && item.icon && <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />}
                    {'href' in item && item.href ? (
                      <a
                        href={item.href}
                        className="hover:text-primary-foreground transition-colors duration-200"
                        data-testid={`link-footer-${item.text.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(`Navigate to ${item.text}`);
                        }}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-primary-foreground/20"
        >
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold text-lg mb-2">Stay Connected</h4>
            <p className="text-primary-foreground/80 mb-4">
              Get weekly updates on events, sermons, and community news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary-foreground/40"
                data-testid="input-newsletter-email"
              />
              <Button
                variant="secondary"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                data-testid="button-newsletter-subscribe"
                onClick={() => console.log('Newsletter subscription')}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 pt-6 border-t border-primary-foreground/20 text-center text-primary-foreground/60"
        >
          <p>
            © {currentYear} Grace Community Church. All rights reserved. | 
            <a 
              href="#" 
              className="hover:text-primary-foreground transition-colors duration-200 ml-1"
              onClick={(e) => {
                e.preventDefault();
                console.log('Privacy policy clicked');
              }}
              data-testid="link-privacy-policy"
            >
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}