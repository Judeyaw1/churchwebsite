import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">Theme Toggle Example</h1>
        <p className="text-muted-foreground mb-8">
          Click the theme toggle to switch between light and dark modes. The setting is saved to localStorage.
        </p>
        
        <div className="bg-card p-8 rounded-lg border border-card-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-foreground">Current theme:</span>
            <ThemeToggle />
          </div>
          <p className="text-sm text-muted-foreground">
            This toggle persists your preference and respects system settings.
          </p>
        </div>
      </div>
    </div>
  );
}