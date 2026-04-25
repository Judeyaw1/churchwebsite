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
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-white/8 blur-3xl" />
        <div className="absolute right-[-10rem] top-[22rem] h-[28rem] w-[28rem] rounded-full bg-white/6 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-white/5 blur-3xl" />
      </div>

      <Navigation />

      <main className="relative z-10">
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

      <Footer />
    </div>
  );
}
