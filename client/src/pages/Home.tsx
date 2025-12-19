import React, { lazy, Suspense } from 'react';
import Snowfall from 'react-snowfall';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';

const CountdownSection = lazy(() => import('@/components/CountdownSection'));
const AboutSection = lazy(() => import('@/components/AboutSection'));
const ServicesSection = lazy(() => import('@/components/ServicesSection'));
const LiveStreamGallerySection = lazy(() => import('@/components/LiveStreamGallerySection'));
const PastorSection = lazy(() => import('@/components/PastorSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));

const SectionFallback = ({ label }: { label: string }) => (
  <div className="py-20 text-center text-white/60">
    Loading {label}…
  </div>
);

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
        <Suspense fallback={<SectionFallback label="Countdown" />}>
          <CountdownSection />
        </Suspense>
        <Suspense fallback={<SectionFallback label="About" />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Ministries" />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Live Stream & Gallery" />}>
          <LiveStreamGallerySection />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Pastor" />}>
          <PastorSection />
        </Suspense>
        <Suspense fallback={<SectionFallback label="Contact" />}>
          <ContactSection />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
