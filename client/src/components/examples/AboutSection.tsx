import AboutSection from '../AboutSection';

export default function AboutSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 text-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">About Section Example</h1>
        <p className="text-muted-foreground">Scroll down to see the animation effects when the section comes into view.</p>
      </div>
      <AboutSection />
      <div className="py-12 text-center">
        <p className="text-muted-foreground">End of About Section - scroll back up to see animations again.</p>
      </div>
    </div>
  );
}