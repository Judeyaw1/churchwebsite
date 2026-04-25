import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Quote,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import pastorImage from '@assets/generated_images/pastor_mark_jpg2.JPG';

interface PastorSectionProps {
  className?: string;
}

export default function PastorSection({ className = '' }: PastorSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pastor = {
    name: 'Rev. Mark Asiedu Frimpong',
    title: 'Senior Pastor',
    image: pastorImage,
    bio: 'Rev. Mark Asiedu Frimpong is a dedicated servant of God with over 15 years of pastoral experience. Born and baptized in the Presbyterian Church, he began his personal walk with God during college and has since served faithfully in ministry.',
    email: 'pastor@unitedbethelpresbyterian.com',
    phone: '(301) 339-3258',
    quote: "My heart is to see every person discover God's love and purpose for their life.",
    education: 'Master of Divinity, Louisville Presbyterian Theological Seminary',
    fullBio: `"When Jesus says, 'Yes,' no one can say, 'No.'"

The powerful truth in this well-known song resonates deeply with the heart of our pastor, Rev. Mark Asiedu Frimpong, a man who has continually witnessed the unfolding work of the Lord in ministering to His children. As he often proclaims, "The Lord takes the natural and adds His super to make it supernatural." Indeed, Rev. Asiedu Frimpong's life is a true reflection of this divine principle.

Born and baptized in the Presbyterian Church, Pastor Frimpong began his personal walk with God during his third year in college—a transformative experience he describes as a "Pauline call" into ministry. He initially served in the Baptist Church for several years before feeling led back to his Presbyterian roots.

In 1994, during the Nanumba–Konkomba conflict in the Northern Region of Ghana, his unwavering faith and bold spirit led him to serve courageously in the midst of danger. It was during this time that he planted his first non-denominational church in Zabzugu Tatale, demonstrating his deep commitment to God's mission even under perilous conditions.

Pastor Frimpong is a proud graduate of Abuakwa State College, Akyem Kibi, and the Kwame Nkrumah University of Science and Technology (KNUST), where he earned a B.S. in Animal Production (1990–1994). He also holds a Postgraduate Diploma in Education (1998–1999) from the University of Cape Coast.

As an educator, he taught science at Abuakwa State College, Praso Kuma Middle School, Mfantsiman Girls' Secondary School, and Langley High School in Virginia. From 1997 to 1999, he served as Head of the Agricultural Science Department at Mfantsiman Girls' Secondary School.

Answering his call to ministry, Rev. Frimpong served in numerous leadership roles within the Presbyterian Church of Ghana in the Central Region, including Local Preacher, Financial Committee Chairman, Christian Education Director, and Evangelism & Lay Training Committee Chairman.

On May 4, 2008, Rev. Frimpong was ordained by the National Capital Presbytery of PC(USA) as a Minister of Word and Sacrament. He served as Pastor of the Ghanaian Presbyterian Church in Maryland (later renamed Christ the King) until March 2014, when he received a divine call to plant a new church. This led to the founding of United Bethel Presbyterian Church, where he continues to serve faithfully as a humble, prayerful, and dynamic preacher—anointed with wisdom, humor, and a deep love for God's people.

Rev. Frimpong is known for his principled and disciplined life, guided by firm convictions and an unshakable passion for ministry.

He is blessed with a loving wife, Mrs. Juliana Asiedu Frimpong, and together they share the joy of parenting their son, Emmanuel Asiedu Frimpong.`,
    specialties: ['Biblical Teaching', 'Pastoral Care', 'Leadership Development', 'Community Outreach'],
    experience: '15+ years in pastoral ministry',
    officeHours: 'Monday-Friday: 9:00 AM - 5:00 PM',
    officeLocation: 'Main Office, First Floor',
  };

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${className}`}
      id="pastor"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.75 }}
          className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/65">Leadership</p>
            <h2 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Shepherded with conviction, warmth, and a deep love for God’s people.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            The homepage needed a pastoral section that feels personal instead of procedural. This
            layout gives Rev. Mark Asiedu Frimpong a stronger presence while keeping his biography,
            calling, and contact path easy to find.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative min-h-[420px] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_38%,rgba(0,0,0,0.72)_100%)]" />
                <img src={pastor.image} alt={pastor.name} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-flex rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
                    Senior Pastor
                  </div>
                  <h3 className="mt-4 font-serif text-3xl text-white sm:text-4xl">{pastor.name}</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-8">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                    <Quote className="h-8 w-8 text-white" />
                    <p className="mt-4 text-lg leading-8 text-white">"{pastor.quote}"</p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-white/65">Pastoral Bio</p>
                      <p className="mt-4 text-base leading-8 text-white/75">{pastor.bio}</p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                      <p className="text-sm uppercase tracking-[0.22em] text-white/45">At A Glance</p>
                      <div className="mt-4 space-y-4 text-sm text-white">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="mt-0.5 h-4 w-4 text-white" />
                          <span>{pastor.education}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="mt-0.5 h-4 w-4 text-white" />
                          <span>{pastor.experience}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-4 w-4 text-white" />
                          <span>{pastor.officeLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {pastor.specialties.map((specialty) => (
                      <div
                        key={specialty}
                        className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white"
                      >
                        {specialty}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                      <a
                        href={`mailto:${pastor.email}`}
                        className="flex items-center gap-3 text-sm text-white transition hover:text-white"
                      >
                        <Mail className="h-4 w-4 text-white" />
                        {pastor.email}
                      </a>
                      <a
                        href={`tel:${pastor.phone}`}
                        className="flex items-center gap-3 text-sm text-white transition hover:text-white"
                      >
                        <Phone className="h-4 w-4 text-white" />
                        {pastor.phone}
                      </a>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Read Full Biography
                      </Button>
                      <Button
                        className="rounded-full bg-white text-black hover:bg-white/90"
                        onClick={() => (window.location.href = `mailto:${pastor.email}`)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Pastor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-white/20 bg-[#0a0a0a] text-white">
            <DialogHeader>
              <DialogTitle className="text-center font-serif text-2xl text-white">
                {pastor.name} - {pastor.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-white/15">
                  <img src={pastor.image} alt={pastor.name} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
                <Quote className="mx-auto h-8 w-8 text-white" />
                <p className="mt-4 text-lg leading-8 text-white/88">"{pastor.quote}"</p>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold text-white">Biography</h3>
                <div className="space-y-4">
                  {pastor.fullBio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="leading-8 text-white/78">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                    <GraduationCap className="h-5 w-5 text-white" />
                    Education
                  </h3>
                  <p className="text-white/72">{pastor.education}</p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                    <Calendar className="h-5 w-5 text-white" />
                    Office Hours
                  </h3>
                  <p className="text-white/72">{pastor.officeHours}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Ministry Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {pastor.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-sm text-white/78"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Contact</h3>
                  <div className="space-y-3 text-white/78">
                    <a href={`mailto:${pastor.email}`} className="flex items-center gap-3 hover:text-white">
                      <Mail className="h-4 w-4 text-white" />
                      {pastor.email}
                    </a>
                    <a href={`tel:${pastor.phone}`} className="flex items-center gap-3 hover:text-white">
                      <Phone className="h-4 w-4 text-white" />
                      {pastor.phone}
                    </a>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-white" />
                      {pastor.officeLocation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
