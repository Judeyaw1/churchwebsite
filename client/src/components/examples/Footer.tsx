import Footer from '../Footer';

export default function FooterExample() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-12 text-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">Footer Example</h1>
        <p className="text-muted-foreground">
          Complete footer with contact info, links, social media, and newsletter signup.
        </p>
      </div>
      <div className="min-h-[50vh] flex items-end">
        <Footer className="w-full" />
      </div>
    </div>
  );
}