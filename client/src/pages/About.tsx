import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Users, Book, Globe, Calendar, MapPin, Clock, Award, Target, Lightbulb } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import communityImage from '@assets/generated_images/Church_community_fellowship_gathering_6de85642.png';
import pastorImage from '@assets/generated_images/Church_pastor_professional_headshot_1618d5ab.png';
import pastorImageJpg from '@assets/generated_images/pastor_mark_jpg.jpg';

export default function About() {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const historyRef = useRef(null);
  const valuesRef = useRef(null);
  const leadershipRef = useRef(null);
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; title: string }[]>([]);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const historyInView = useInView(historyRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });
  const leadershipInView = useInView(leadershipRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setGalleryImages(data);
        }
      } catch (err) {
        console.error('Failed to fetch gallery images for About page', err);
      }
    };
    loadGallery();
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Faith & Worship',
      description: 'We gather to worship God through traditional Presbyterian liturgy, meaningful music, and heartfelt prayer that connects us to our Creator.'
    },
    {
      icon: Users,
      title: 'Fellowship & Community',
      description: 'Building authentic relationships through small groups, fellowship meals, and shared experiences that strengthen our church family.'
    },
    {
      icon: Book,
      title: 'Biblical Foundation',
      description: 'Rooted in Reformed theology, we study Scripture together and apply God\'s teachings to guide our daily lives and decisions.'
    },
    {
      icon: Globe,
      title: 'Service & Mission',
      description: 'Committed to serving our neighbors through local outreach, global missions, and social justice initiatives that reflect Christ\'s love.'
    }
  ];

  const leadership = [
    {
      name: 'Rev. Mark Asiedu Frimpong',
      position: 'Senior Pastor',
      image: pastorImage,
      bio: 'Rev. Mark Asiedu Frimpong is a dedicated servant of God with over 15 years of pastoral experience. Born and baptized in the Presbyterian Church, he began his personal walk with God during college and has since served faithfully in ministry.',
      education: 'Master of Divinity, Princeton Theological Seminary',
      experience: '15+ years in pastoral ministry'
    },
    {
      name: 'Elder Sarah Johnson',
      position: 'Session Clerk',
      image: communityImage,
      bio: 'Sarah has been a faithful member of United Bethel for over 20 years and serves as our Session Clerk, helping to guide the spiritual and administrative life of our congregation.',
      education: 'Bachelor of Arts, Community Leadership',
      experience: '20+ years of church leadership'
    },
    {
      name: 'Deacon Michael Chen',
      position: 'Deacon Board Chair',
      image: pastorImageJpg,
      bio: 'Michael leads our Deacon Board in caring for the practical needs of our congregation and community, ensuring that no one in our church family goes without support.',
      education: 'Master of Social Work',
      experience: '10+ years in community service'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 bg-gradient-to-b from-black/95 to-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              About <span className="text-white">United Bethel</span> Presbyterian
            </h1>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Discover our story, mission, and the community that makes United Bethel Presbyterian 
              a place where faith meets fellowship and hearts find home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section ref={missionRef} className="py-20 bg-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Our <span className="text-white">Mission</span> & Vision
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <Target className="h-6 w-6 text-white mr-3" />
                    <h3 className="text-xl font-semibold text-white">Our Mission</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    To glorify God by making disciples of Jesus Christ through worship, 
                    fellowship, discipleship, ministry, and evangelism. We are committed 
                    to being a beacon of hope and faith in our community.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <Lightbulb className="h-6 w-6 text-white mr-3" />
                    <h3 className="text-xl font-semibold text-white">Our Vision</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    To be a thriving Presbyterian community where all people can grow in 
                    faith, serve others, and experience the transforming love of Christ. 
                    We envision a church that impacts our neighborhood and beyond.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <img
                src={galleryImages[0]?.url || pastorImageJpg}
                alt={galleryImages[0]?.title || "United Bethel Presbyterian Church"}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-xl font-semibold drop-shadow-lg">Our Church Home</h3>
                <p className="text-sm opacity-90 drop-shadow-md">A place of worship and community</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section ref={historyRef} className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={historyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Our <span className="text-white">History</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={historyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src={communityImage}
                alt="Church community gathering"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-xl font-semibold drop-shadow-lg">Community Fellowship</h3>
                <p className="text-sm opacity-90 drop-shadow-md">Growing together in faith</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={historyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-white mr-3" />
                    <h3 className="text-xl font-semibold text-white">Founded in 1995</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    United Bethel Presbyterian Church was established by a small group of 
                    faithful believers who wanted to create a welcoming place of worship 
                    in our community.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <Award className="h-6 w-6 text-white mr-3" />
                    <h3 className="text-xl font-semibold text-white">30 Years of Service</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Over the past three decades, we have grown from a small congregation 
                    to a vibrant church family serving our community through worship, 
                    education, and outreach ministries.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center mb-4">
                    <Users className="h-6 w-6 text-white mr-3" />
                    <h3 className="text-xl font-semibold text-white">Growing Community</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Today, we are blessed with over 150 members and continue to welcome 
                    new families into our church community, growing together in faith 
                    and service.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 bg-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Our <span className="text-white">Core Values</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              These fundamental principles guide everything we do as a church community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white/5 rounded-lg p-8 hover-elevate transition-all duration-300 border border-white/10 h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-white/10 p-3 rounded-lg mr-4 group-hover:bg-white/20 transition-colors duration-300">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section ref={leadershipRef} className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={leadershipInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Our <span className="text-white">Leadership</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated leaders who guide our church community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                animate={leadershipInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white/5 rounded-lg overflow-hidden hover-elevate transition-all duration-300 border border-white/10">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{leader.name}</h3>
                    <p className="text-white/70 font-medium mb-3">{leader.position}</p>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">{leader.bio}</p>
                    <div className="space-y-2">
                      <p className="text-white/60 text-xs">
                        <span className="font-medium">Education:</span> {leader.education}
                      </p>
                      <p className="text-white/60 text-xs">
                        <span className="font-medium">Experience:</span> {leader.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Times Section */}
      <section className="py-20 bg-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Join Us for <span className="text-white">Worship</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              We welcome you to join our church family for worship and fellowship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
              <Clock className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sunday Services</h3>
              <p className="text-white/80">9:00 AM & 11:00 AM</p>
            </div>
            <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
              <Calendar className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Bible Study</h3>
              <p className="text-white/80">Wednesdays 7:00 PM</p>
            </div>
            <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
              <MapPin className="h-8 w-8 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Location</h3>
              <p className="text-white/80">9045 Maier Rd<br />Laurel, MD 20723</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

