import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import StaffSection from '@/components/StaffSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation with Theme Toggle */}
      <Navigation />
      
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Page Sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <StaffSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}