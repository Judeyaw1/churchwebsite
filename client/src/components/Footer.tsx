import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleNewsletterSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('success');
        setSubscriptionMessage('Thank you for subscribing! Check your email for a welcome message.');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
        setSubscriptionMessage(data.message || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerSections = [
    {
      title: 'Visit Us',
      items: [
        { icon: MapPin, text: '9045 Maier Road' },
        { text: 'Laurel, MD 20723' },
        { icon: Phone, text: '(555) 123-4567' },
        { icon: Mail, text: 'unitedbethelpresbyterian@gmail.com', href: 'mailto:unitedbethelpresbyterian@gmail.com' }
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
        { text: 'Home', href: '/home' },
        { text: 'About', href: '/about' },
        { text: 'Gallery/Live', href: '/Gallery/Live' },
        { text: 'Events', href: '/events' }
      ]
    },
    {
      title: 'Groups',
      items: [
        { text: 'Men\'s Fellowship', href: '/groups/mens-fellowship' },
        { text: 'YAF', href: '/groups/yaf' },
        { text: 'YPG', href: '/groups/ypg' },
        { text: 'JY', href: '/groups/jy' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/unitedbethelpresbyterian' },
    { icon: Twitter, label: 'Tiktok', href: 'https://www.tiktok.com/@ubpc_md_usa?_r=1&_t=ZP-92PhPbkitVX' },
    { icon: Youtube, label: 'YouTube', href: 'http://www.youtube.com/@ubpcmedia6480' }
  ];

  return (
    <footer className={`bg-black/95 text-white border-t border-white/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Church Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="font-serif text-2xl font-bold mb-4 text-white">United Bethel Presbyterian</h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              A place where faith meets community, and hearts find home. Join us for worship, 
              fellowship, and spiritual growth.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                  onClick={() => window.open(social.href, '_blank')}
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
              <h4 className="font-semibold text-lg mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="flex items-center text-white/80">
                    {'icon' in item && item.icon && <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />}
                    {'href' in item && item.href ? (
                      <a
                        href={item.href}
                        className="hover:text-white transition-colors duration-200"
                        data-testid={`link-footer-${item.text.toLowerCase().replace(/\s+/g, '-')}`}
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
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold text-lg mb-2 text-white">Stay Connected</h4>
            <p className="text-white/80 mb-4">
              Get weekly updates on events, sermons, and community news.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
                  data-testid="input-newsletter-email"
                  disabled={isSubscribing}
                />
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  data-testid="button-newsletter-subscribe"
                  onClick={handleNewsletterSubscribe}
                  disabled={isSubscribing || !email}
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              
              {/* Status Messages */}
              {subscriptionStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-300 text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  {subscriptionMessage}
                </motion.div>
              )}
              
              {subscriptionStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-300 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  {subscriptionMessage}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 pt-6 border-t border-white/20 text-center text-white/60"
        >
          <p>
            © {currentYear} United Bethel Presbyterian Church. All rights reserved. | 
            <a 
              href="/privacy" 
              className="hover:text-white transition-colors duration-200 ml-1"
              data-testid="link-privacy-policy"
            >
              JoseSolutions
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
