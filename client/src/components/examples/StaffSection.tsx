import StaffSection from '../StaffSection';

export default function StaffSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 text-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">Staff Section Example</h1>
        <p className="text-muted-foreground">Click on staff cards to see expanded information with quotes and contact options.</p>
      </div>
      <StaffSection />
      <div className="py-12 text-center">
        <p className="text-muted-foreground">End of Staff Section</p>
      </div>
    </div>
  );
}