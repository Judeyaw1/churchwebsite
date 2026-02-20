import { AlertTriangle, ArrowLeft, Compass, Home, Mail } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Blog", href: "/blog" },
    { label: "Gallery / Live", href: "/gallery" },
  ];

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <Navigation />

      <main className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 bg-gradient-to-b from-black via-[#121212] to-black">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm uppercase tracking-[0.16em] text-white/85">
                <AlertTriangle className="h-4 w-4" />
                Error 404
              </div>

              <div>
                <p className="text-white/60 text-sm sm:text-base">United Bethel Presbyterian Church</p>
                <h1 className="mt-3 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
                  Page Not Found
                </h1>
                <p className="mt-5 max-w-xl text-white/75 text-base sm:text-lg leading-relaxed">
                  The page you requested does not exist or may have been moved. Use the options
                  below to continue exploring the site.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90">
                    <Home className="h-4 w-4 mr-2" />
                    Go To Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-5 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <Compass className="h-5 w-5 text-white/85" />
                <h2 className="text-xl sm:text-2xl font-serif">Try These Pages</h2>
              </div>
              <div className="grid gap-3">
                {quickLinks.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white/85 hover:text-white hover:bg-white/10 transition-colors">
                      {item.label}
                    </a>
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-white/10 bg-black/35 p-4">
                <p className="text-white/75 text-sm sm:text-base">
                  Need help finding something specific?
                </p>
                <a
                  href="/#contact"
                  className="mt-3 inline-flex items-center text-white font-medium hover:text-white/80 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact UBPC Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
