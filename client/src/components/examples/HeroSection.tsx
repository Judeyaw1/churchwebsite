import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="p-8 bg-background text-center">
        <h2 className="text-2xl font-serif text-foreground">Hero Section Complete</h2>
        <p className="text-muted-foreground mt-2">Scroll back up to see the full hero section with animations.</p>
      </div>
    </div>
  );
}