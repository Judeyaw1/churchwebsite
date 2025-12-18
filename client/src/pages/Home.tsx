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
      <Snowfall
        snowflakeCount={100}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      />

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