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
  const [isBlogOpen, setIsBlogOpen] = useState(false);

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

      if (isBlogOpen) {
        const blogDropdown = target.closest('[data-blog-dropdown]');
        const blogButton = target.closest('[data-blog-button]');
        if (!blogDropdown && !blogButton) {
          setIsBlogOpen(false);
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

    if (isGroupsOpen || isMinistryOpen || isBlogOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isGroupsOpen, isMinistryOpen, isBlogOpen, isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '#', hasDropdown: true, dropdownKey: 'blog' },
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
    { label: 'Levite', href: '/ministry/Leviste' },
    { label: 'Singing Band', href: '/ministry/Singing Band' },
  ];

  const blogItems = [
    { label: 'Blog', href: '/blog' },
    { label: 'Announcements', href: '/announcements' },
  ];

  const handleVisitUs = () => {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = '/#contact';
  };

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = '/';
  };

  const desktopLinkClass =
    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-all duration-300 hover:bg-white/10 hover:text-white';

  const mobileLinkClass =
    'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-white/85 transition-all duration-300 hover:bg-white/10 hover:text-white';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 px-2 pt-2 transition-all duration-500 ease-out sm:px-4 sm:pt-3 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div
          className={`flex h-16 items-center justify-between rounded-[1.75rem] border px-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition-all duration-500 sm:px-4 ${
            isScrolled
              ? 'border-white/5 bg-black/72 backdrop-blur-2xl'
              : 'border-white/4 bg-black/42 backdrop-blur-xl'
          }`}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={handleHomeClick}
            className="group flex items-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 rounded-full bg-white/[0.04] px-2.5 py-2"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRslI3U8-lsDRRpnOt-lxkEMYZvV6Wtdzv3TQ&s"
                alt="United Bethel Presbyterian logo"
                className="h-8 w-8 rounded-full object-contain bg-transparent"
                loading="eager"
                decoding="async"
              />
              <div className="leading-tight">
                <a
                  href="https://maps.google.com/?q=9045+Maier+Road+Suite+D,+Laurel,+MD+20723"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[0.6rem] uppercase tracking-[0.28em] text-white/45 transition hover:text-white/80"
                  onClick={(event) => event.stopPropagation()}
                >
                  Laurel, MD
                </a>
                <span className="font-serif text-base font-bold text-white transition-colors duration-300 sm:text-lg lg:text-xl">
                  <span className="hidden lg:inline">United Bethel Presbyterian</span>
                  <span className="lg:hidden">UBPC</span>
                </span>
              </div>
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-white/[0.04] p-1.5">
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
                    data-blog-dropdown={item.dropdownKey === 'blog' ? true : undefined}
                    onMouseEnter={() => {
                      if (item.dropdownKey === 'groups') {
                        setIsGroupsOpen(true);
                        setIsMinistryOpen(false);
                        setIsBlogOpen(false);
                      } else if (item.dropdownKey === 'ministry') {
                        setIsMinistryOpen(true);
                        setIsGroupsOpen(false);
                        setIsBlogOpen(false);
                      } else {
                        setIsBlogOpen(true);
                        setIsGroupsOpen(false);
                        setIsMinistryOpen(false);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.dropdownKey === 'groups') {
                        setIsGroupsOpen(false);
                      } else if (item.dropdownKey === 'ministry') {
                        setIsMinistryOpen(false);
                      } else {
                        setIsBlogOpen(false);
                      }
                    }}
                  >
                    <button
                      data-groups-button={item.dropdownKey === 'groups' ? true : undefined}
                      data-ministry-button={item.dropdownKey === 'ministry' ? true : undefined}
                      data-blog-button={item.dropdownKey === 'blog' ? true : undefined}
                      className={desktopLinkClass}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          item.dropdownKey === 'groups'
                            ? (isGroupsOpen ? 'rotate-180' : '')
                            : item.dropdownKey === 'ministry'
                              ? (isMinistryOpen ? 'rotate-180' : '')
                              : (isBlogOpen ? 'rotate-180' : '')
                        }`}
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {(item.dropdownKey === 'groups' ? isGroupsOpen : item.dropdownKey === 'ministry' ? isMinistryOpen : isBlogOpen) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full z-50 mt-3 w-56 rounded-2xl border border-white/12 bg-black/95 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.46)] backdrop-blur-2xl"
                          data-groups-dropdown={item.dropdownKey === 'groups' ? true : undefined}
                          data-ministry-dropdown={item.dropdownKey === 'ministry' ? true : undefined}
                          data-blog-dropdown={item.dropdownKey === 'blog' ? true : undefined}
                        >
                          {(item.dropdownKey === 'groups' ? groupsItems : item.dropdownKey === 'ministry' ? ministryItems : blogItems).map((groupItem) => (
                            <Link key={groupItem.label} href={groupItem.href}>
                              <a
                                className="mx-2 block rounded-xl px-4 py-2.5 text-sm text-white/82 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                                onClick={() => {
                                  if (item.dropdownKey === 'groups') {
                                    setIsGroupsOpen(false);
                                  } else if (item.dropdownKey === 'ministry') {
                                    setIsMinistryOpen(false);
                                  } else {
                                    setIsBlogOpen(false);
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
                ) : item.label === 'Home' ? (
                  <a
                    href="/"
                    onClick={handleHomeClick}
                    className={desktopLinkClass}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                    title={item.label}
                  >
                    {item.icon ? <item.icon className="h-5 w-5" /> : item.label}
                  </a>
                ) : (
                  <Link href={item.href}>
                    <a
                      className={desktopLinkClass}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                      title={item.label}
                    >
                      {item.icon ? <item.icon className="h-5 w-5" /> : item.label}
                    </a>
                  </Link>
                )}
              </motion.div>
            ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button 
                variant="default" 
                className="rounded-full bg-white px-5 text-black hover:bg-white/90"
                data-testid="button-visit-us"
                onClick={handleVisitUs}
              >
                Visit Us
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
              className="rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors duration-300 hover:bg-white/10"
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
            <>
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
                className="lg:hidden fixed inset-0 top-16 bg-black/50 backdrop-blur-[2px]"
                aria-label="Close mobile navigation"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden fixed right-3 top-[5.25rem] h-[calc(100dvh-5.75rem)] w-[88vw] max-w-sm overflow-y-auto rounded-[2rem] border border-white/14 bg-black/92 shadow-[0_30px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
              >
                <div className="space-y-5 px-4 py-5">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/45">
                      United Bethel Presbyterian Church
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/74">
                      Explore worship, events, fellowship groups, and ministry life from one place.
                    </p>
                  </div>
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.25 }}
                    >
                      {item.hasDropdown ? (
                        <div>
                          <button
                            className={`w-full ${mobileLinkClass} justify-between text-left`}
                            onClick={() => {
                              if (item.dropdownKey === 'groups') {
                                setIsGroupsOpen(!isGroupsOpen);
                                setIsMinistryOpen(false);
                                setIsBlogOpen(false);
                              } else if (item.dropdownKey === 'ministry') {
                                setIsMinistryOpen(!isMinistryOpen);
                                setIsGroupsOpen(false);
                                setIsBlogOpen(false);
                              } else {
                                setIsBlogOpen(!isBlogOpen);
                                setIsGroupsOpen(false);
                                setIsMinistryOpen(false);
                              }
                            }}
                          >
                            <span className="text-base">{item.label}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                item.dropdownKey === 'groups'
                                  ? (isGroupsOpen ? 'rotate-180' : '')
                                  : item.dropdownKey === 'ministry'
                                    ? (isMinistryOpen ? 'rotate-180' : '')
                                    : (isBlogOpen ? 'rotate-180' : '')
                              }`}
                            />
                          </button>
                          
                          {/* Mobile Dropdown */}
                          <AnimatePresence>
                            {(item.dropdownKey === 'groups' ? isGroupsOpen : item.dropdownKey === 'ministry' ? isMinistryOpen : isBlogOpen) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                                className="ml-3 mt-2 space-y-2 rounded-2xl border border-white/8 bg-black/85 p-2 backdrop-blur-xl"
                              >
                                {(item.dropdownKey === 'groups' ? groupsItems : item.dropdownKey === 'ministry' ? ministryItems : blogItems).map((groupItem) => (
                                  <Link key={groupItem.label} href={groupItem.href}>
                                    <a
                                      className="block rounded-xl px-3 py-2.5 text-white/82 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                                      onClick={() => {
                                        setIsMenuOpen(false);
                                        if (item.dropdownKey === 'groups') {
                                          setIsGroupsOpen(false);
                                        } else if (item.dropdownKey === 'ministry') {
                                          setIsMinistryOpen(false);
                                        } else {
                                          setIsBlogOpen(false);
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
                      ) : item.label === 'Home' ? (
                        <a
                          href="/"
                          onClick={(event) => {
                            setIsMenuOpen(false);
                            handleHomeClick(event);
                          }}
                          className={mobileLinkClass}
                          data-testid={`link-mobile-${item.label.toLowerCase()}`}
                        >
                          {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                          <span className="text-base">{item.label}</span>
                        </a>
                      ) : (
                        <Link href={item.href}>
                          <a
                            className={mobileLinkClass}
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
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.25 }}
                    className="pt-2"
                  >
                    <Button 
                      variant="default" 
                      className="w-full rounded-full bg-white py-3 text-base font-semibold text-black hover:bg-white/90"
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
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
