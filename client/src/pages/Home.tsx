import React from 'react';
import Snowfall from 'react-snowfall';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import LiveStreamGallerySection from '@/components/LiveStreamGallerySection';
import PastorSection from '@/components/PastorSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Snowfall Effect */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, pointerEvents: 'none' }}>
        <Snowfall
          snowflakeCount={60}
          speed={[0.5, 3]}
          wind={[-0.5, 3]}
          radius={[0.4, 2]}
        />
      </div>

      {/* Navigation with Theme Toggle */}
      <Navigation />
      

      {/* Page Sections */}
      <main>
        <HeroSection />
        <CountdownSection />
        <AboutSection />
        <ServicesSection />
        <LiveStreamGallerySection />
        <PastorSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}