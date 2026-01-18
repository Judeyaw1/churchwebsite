import React, { lazy, Suspense } from 'react';
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
