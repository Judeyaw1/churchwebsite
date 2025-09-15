import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <div className="h-screen bg-gradient-to-b from-background to-card">
      <Navigation />
      <div className="pt-24 px-8 text-center">
        <h1 className="text-2xl font-serif text-foreground">
          Navigation Component Example
        </h1>
        <p className="text-muted-foreground mt-4">
          Scroll down to see the navigation background change. Try the mobile menu on smaller screens.
        </p>
        <div className="mt-8 space-y-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-8 bg-card rounded-lg shadow-sm">
              <h2 className="text-xl font-medium">Section {i + 1}</h2>
              <p className="text-muted-foreground mt-2">Content to demonstrate scrolling behavior.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}