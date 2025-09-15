import ContactSection from '../ContactSection';

export default function ContactSectionExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 text-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">Contact Section Example</h1>
        <p className="text-muted-foreground">Fill out the form to see interactive form validation and submission.</p>
      </div>
      <ContactSection />
      <div className="py-12 text-center bg-background">
        <p className="text-muted-foreground">End of Contact Section</p>
      </div>
    </div>
  );
}