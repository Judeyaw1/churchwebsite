import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Sparkles, HeartHandshake, BookOpen } from 'lucide-react';

export default function WomensFellowship() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pt-24 pb-16 bg-gradient-to-b from-black/95 via-black/90 to-black/85">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-left"
          >
            <p className="text-white/70 uppercase tracking-[0.2em] text-xs sm:text-sm mb-4">
              United Bethel Presbyterian Church
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              Women&apos;s Fellowship
            </h1>
            <p className="text-lg sm:text-xl text-white/85 max-w-3xl leading-relaxed">
              A sisterhood dedicated to love, unity, and lives that reflect Christ wherever we are.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-black/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Our Aim</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              The Aim of the United Bethel Presbyterian Church&apos;s Women&apos;s Fellowship is to help the
              women in UBPC Church lead exemplary lives as Christian women in love and unity, so that
              wherever they may be - at home, in the church, or any public place - their behavior and
              actions are exemplary and attract other women to Christ.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-white" />
              <h2 className="text-2xl font-serif text-white">Scripture Focus</h2>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">
              Matthew 5:16 says, &quot;In the same way, let your light shine before others, so that they
              may see your good works and give glory to your Father who is in heaven.&quot;
            </p>
            <p className="text-white/70 leading-relaxed">
              This is a call to live a life of integrity and good deeds that are visible, not for
              self-glory, but so that others are led to praise and glorify God.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-black/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/10 rounded-2xl p-6 sm:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-6 w-6 text-white" />
              <h2 className="text-2xl sm:text-3xl font-serif text-white">Let Your Light Shine</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Live with Integrity</h3>
                <p className="text-white/75">
                  Let your light shine through sincerity, diligence, and a commitment to truth and
                  good character.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Practice Good Works</h3>
                <p className="text-white/75">
                  Good works flow from faith and are seen in love, service, and unity within our
                  families and community.
                </p>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-2">Give God the Glory</h3>
                <p className="text-white/75">
                  The purpose of shining is not self-glorification, but to lead others to praise our
                  Father in heaven.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-black/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-serif text-white mb-4">
              Join the Women&apos;s Fellowship
            </h2>
            <p className="text-white/80 mb-6">
              We welcome every woman to grow in faith, love, and community. Let&apos;s shine together.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-lg bg-white text-black px-6 py-3 font-semibold hover:bg-black/90 hover:text-white transition-colors"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
