import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const [isMinistryOpen, setIsMinistryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close Groups dropdown if clicking outside
      if (isGroupsOpen) {
        const groupsDropdown = target.closest('[data-groups-dropdown]');
        const groupsButton = target.closest('[data-groups-button]');
        if (!groupsDropdown && !groupsButton) {
          setIsGroupsOpen(false);
        }
      }

      // Close Ministry dropdown if clicking outside
      if (isMinistryOpen) {
        const ministryDropdown = target.closest('[data-ministry-dropdown]');
        const ministryButton = target.closest('[data-ministry-button]');
        if (!ministryDropdown && !ministryButton) {
          setIsMinistryOpen(false);
        }
      }
      
      // Close mobile menu when clicking outside
      if (isMenuOpen) {
        const navElement = target.closest('nav');
        const menuButton = target.closest('[data-testid="button-mobile-menu"]');
        if (!navElement && !menuButton) {
          setIsMenuOpen(false);
        }
      }
    };

    if (isGroupsOpen || isMinistryOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isGroupsOpen, isMinistryOpen, isMenuOpen]);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'Gallery/Live', href: '/gallery' },
    { label: 'Groups', href: '#', hasDropdown: true, dropdownKey: 'groups' },
    { label: 'Ministry', href: '#', hasDropdown: true, dropdownKey: 'ministry' },
    { label: 'Admin', href: '/admin/login', icon: LogIn } // Admin login link with icon
  ];

  const groupsItems = [
    { label: 'Men\'s Fellowship', href: '/groups/mens-fellowship' },
    { label: 'Women\'s Fellowship', href: '/groups/womens-fellowship' },
    { label: 'YAF', href: '/groups/yaf' },
    { label: 'YPG', href: '/groups/ypg' },
    { label: 'JY', href: '/groups/jy' },
    { label: 'CPC', href: '/groups/CPC' },
  ];

  const ministryItems = [
    { label: 'Leviate', href: '/ministry/Leviate' },
    { label: 'Singing Band', href: '/ministry/Singing Band' },
  ];

  const handleVisitUs = () => {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = '/#contact';
  };

  
  

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-black/5 backdrop-blur-sm border-b border-white/10'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRslI3U8-lsDRRpnOt-lxkEMYZvV6Wtdzv3TQ&s"
                  alt="United Bethel Presbyterian logo"
                  className="h-8 w-8 rounded-full object-contain bg-transparent mr-2"
                  loading="eager"
                  decoding="async"
                />
                <span className={`font-serif text-lg sm:text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-white' : 'text-white'
                }`}>
                  <span className="hidden sm:inline">United Bethel Presbyterian</span>
                  <span className="sm:hidden">UBPC</span>
                </span>
              </motion.div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="relative"
              >
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    data-groups-dropdown={item.dropdownKey === 'groups' ? true : undefined}
                    data-ministry-dropdown={item.dropdownKey === 'ministry' ? true : undefined}
                    onMouseEnter={() => {
                      if (item.dropdownKey === 'groups') {
                        setIsGroupsOpen(true);
                        setIsMinistryOpen(false);
                      } else {
                        setIsMinistryOpen(true);
                        setIsGroupsOpen(false);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.dropdownKey === 'groups') {
                        setIsGroupsOpen(false);
                      } else {
                        setIsMinistryOpen(false);
                      }
                    }}
                  >
                    <button
                      data-groups-button={item.dropdownKey === 'groups' ? true : undefined}
                      data-ministry-button={item.dropdownKey === 'ministry' ? true : undefined}
                      className={`transition-all duration-300 font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-lg ${
                        isScrolled 
                          ? 'text-white hover:text-white/80 hover:bg-white/20 hover:backdrop-blur-sm' 
                          : 'text-white hover:text-white/90 hover:bg-white/10 hover:backdrop-blur-sm'
                      }`}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          item.dropdownKey === 'groups' ? (isGroupsOpen ? 'rotate-180' : '') : (isMinistryOpen ? 'rotate-180' : '')
                        }`}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {(item.dropdownKey === 'groups' ? isGroupsOpen : isMinistryOpen) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-black/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 py-2 z-50"
                          data-groups-dropdown={item.dropdownKey === 'groups' ? true : undefined}
                          data-ministry-dropdown={item.dropdownKey === 'ministry' ? true : undefined}
                        >
                          {(item.dropdownKey === 'groups' ? groupsItems : ministryItems).map((groupItem) => (
                            <Link key={groupItem.label} href={groupItem.href}>
                              <a
                                className="block px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                                onClick={() => {
                                  if (item.dropdownKey === 'groups') {
                                    setIsGroupsOpen(false);
                                  } else {
                                    setIsMinistryOpen(false);
                                  }
                                }}
                              >
                                {groupItem.label}
                              </a>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href={item.href}>
                    <a
                      className={`transition-all duration-300 font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-lg ${
                        isScrolled 
                          ? 'text-white hover:text-white/80 hover:bg-white/20 hover:backdrop-blur-sm' 
                          : 'text-white hover:text-white/90 hover:bg-white/10 hover:backdrop-blur-sm'
                      }`}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                      title={item.label}
                    >
                      {item.icon ? <item.icon className="h-5 w-5" /> : item.label}
                    </a>
                  </Link>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button 
                variant="default" 
                className="bg-black hover:bg-black/90 text-white border border-white/20"
                data-testid="button-visit-us"
                onClick={handleVisitUs}
              >
                Visit Us
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
              className={`transition-colors duration-300 ${
                isScrolled ? 'text-white' : 'text-white'
              }`}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 mt-2 mb-4 mx-2"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {item.hasDropdown ? (
                      <div>
                        <button
                          className={`w-full text-left transition-colors duration-300 font-medium text-sm py-3 px-3 rounded-lg flex items-center justify-between hover:bg-white/10 ${
                            isScrolled 
                              ? 'text-white hover:text-white/80' 
                              : 'text-white hover:text-white/80'
                          }`}
                          onClick={() => {
                            if (item.dropdownKey === 'groups') {
                              setIsGroupsOpen(!isGroupsOpen);
                              setIsMinistryOpen(false);
                            } else {
                              setIsMinistryOpen(!isMinistryOpen);
                              setIsGroupsOpen(false);
                            }
                          }}
                        >
                          <span className="text-base">{item.label}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              item.dropdownKey === 'groups' ? (isGroupsOpen ? 'rotate-180' : '') : (isMinistryOpen ? 'rotate-180' : '')
                            }`}
                          />
                        </button>
                        
                        {/* Mobile Dropdown */}
                        <AnimatePresence>
                          {(item.dropdownKey === 'groups' ? isGroupsOpen : isMinistryOpen) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-2 space-y-2 bg-black/60 backdrop-blur-sm rounded-lg p-2"
                            >
                              {(item.dropdownKey === 'groups' ? groupsItems : ministryItems).map((groupItem) => (
                                <Link key={groupItem.label} href={groupItem.href}>
                                  <a
                                    className="block py-2 px-3 text-white hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      if (item.dropdownKey === 'groups') {
                                        setIsGroupsOpen(false);
                                      } else {
                                        setIsMinistryOpen(false);
                                      }
                                    }}
                                  >
                                    {groupItem.label}
                                  </a>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link href={item.href}>
                        <a
                          className={`block transition-colors duration-300 font-medium text-sm py-3 px-3 rounded-lg flex items-center gap-3 hover:bg-white/10 ${
                            isScrolled 
                              ? 'text-white hover:text-white/80' 
                              : 'text-white hover:text-white/80'
                          }`}
                          data-testid={`link-mobile-${item.label.toLowerCase()}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                          <span className="text-base">{item.label}</span>
                        </a>
                      </Link>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="pt-2"
                >
                  <Button 
                    variant="default" 
                    className="w-full bg-black hover:bg-black/90 text-white border border-white/20 py-3 text-base font-semibold"
                    data-testid="button-mobile-visit-us"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleVisitUs();
                    }}
                  >
                    Visit Us
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
