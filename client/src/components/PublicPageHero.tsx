import React from 'react';
import { motion } from 'framer-motion';

interface PublicPageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}

export default function PublicPageHero({
  eyebrow = 'United Bethel Presbyterian Church',
  title,
  description,
  align = 'center',
}: PublicPageHeroProps) {
  const alignmentClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const headingClass = align === 'center' ? 'max-w-5xl mx-auto' : 'max-w-5xl';
  const descriptionClass = align === 'center' ? 'mt-6 max-w-3xl mx-auto' : 'mt-6 max-w-3xl';

  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,#040404_0%,#090909cc_42%,transparent_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className={alignmentClass}
        >
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-white/65 sm:text-sm">
            {eyebrow}
          </p>
          <h1 className={`${headingClass} font-serif text-4xl font-bold leading-[0.95] text-white sm:text-5xl lg:text-6xl`}>
            {title}
          </h1>
          <p className={`${descriptionClass} text-lg leading-8 text-white/78 sm:text-xl`}>
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
