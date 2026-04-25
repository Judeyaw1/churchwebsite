import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface PublicPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PublicPageLayout({
  children,
  className = '',
}: PublicPageLayoutProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#050505] text-white ${className}`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-7rem] h-[20rem] w-[20rem] rounded-full bg-white/8 blur-3xl sm:left-[-12rem] sm:top-[-10rem] sm:h-[30rem] sm:w-[30rem]" />
        <div className="absolute right-[-7rem] top-[18rem] h-[18rem] w-[18rem] rounded-full bg-white/6 blur-3xl sm:right-[-10rem] sm:top-[22rem] sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute bottom-[-8rem] left-1/4 h-[22rem] w-[22rem] rounded-full bg-white/5 blur-3xl sm:bottom-[-12rem] sm:left-1/3 sm:h-[32rem] sm:w-[32rem]" />
      </div>

      <Navigation />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
