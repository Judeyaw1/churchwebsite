import ServicesSection from '../ServicesSection';

export default function ServicesSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 text-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">Services Section Example</h1>
        <p className="text-muted-foreground">Click on service cards to expand details. Scroll to see animations.</p>
      </div>
      <ServicesSection />
      <div className="py-12 text-center bg-background">
        <p className="text-muted-foreground">End of Services Section</p>
      </div>
    </div>
  );
}