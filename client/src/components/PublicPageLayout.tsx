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
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-white/8 blur-3xl" />
        <div className="absolute right-[-10rem] top-[22rem] h-[28rem] w-[28rem] rounded-full bg-white/6 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-white/5 blur-3xl" />
      </div>

      <Navigation />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
