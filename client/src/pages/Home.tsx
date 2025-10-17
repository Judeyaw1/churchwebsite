import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import LiveStreamGallerySection from '@/components/LiveStreamGallerySection';
import PastorSection from '@/components/PastorSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation with Theme Toggle */}
      <Navigation />
      

      {/* Page Sections */}
      <main>
        <HeroSection />
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