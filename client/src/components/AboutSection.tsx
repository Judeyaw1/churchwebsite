import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Heart, Users, Book, Globe, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import communityImage from '@assets/generated_images/Church_community_fellowship_gathering_6de85642.png';
import pastorImage from '@assets/generated_images/Church_pastor_professional_headshot_1618d5ab.png';
import pastorImageJpg from '@assets/generated_images/pastor_mark_jpg.jpg';

interface AboutSectionProps {
  className?: string;
}

export default function AboutSection({ className = '' }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentLeftImageIndex, setCurrentLeftImageIndex] = useState(0);
  const [currentRightImageIndex, setCurrentRightImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<{ url: string; title: string }[]>([]);

  const communityImages = [
    {
      src: communityImage,
      alt: "Church community fellowship gathering",
      title: "Community Fellowship",
      description: "Growing together in faith"
    },
    {
      src: pastorImage,
      alt: "Church pastor professional headshot",
      title: "Pastoral Leadership",
      description: "Guiding with wisdom and grace"
    },
    {
      src: pastorImageJpg,
      alt: "Modern church exterior building",
      title: "Our Church Home",
      description: "A place of worship and community"
    }
  ];

  const leftCardImages = [
    {
      src: pastorImage,
      alt: "Pastor leading worship",
      title: "Spiritual Leadership",
      description: "Guiding our faith journey"
    },
    {
      src: communityImage,
      alt: "Community gathering",
      title: "Fellowship",
      description: "Building lasting relationships"
    },
    {
      src: pastorImageJpg,
      alt: "Church sanctuary",
      title: "Worship Space",
      description: "A sacred place of prayer"
    }
  ];

  const rightCardImages = [
    {
      src: pastorImageJpg,
      alt: "Church exterior",
      title: "Our Home",
      description: "Welcome to our church"
    },
    {
      src: pastorImage,
      alt: "Pastor teaching",
      title: "Biblical Teaching",
      description: "Learning God's word together"
    },
    {
      src: communityImage,
      alt: "Community service",
      title: "Service",
      description: "Serving others in love"
    }
  ];

  // Load gallery images for replacements
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          // Shuffle to mix visuals
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setGalleryImages(shuffled);
        }
      } catch (err) {
        console.error('Failed to fetch gallery images for About section', err);
      }
    };
    loadGallery();
  }, []);

  const heroSources = galleryImages.length
    ? galleryImages.map((g) => ({
        src: g.url,
        alt: g.title || 'Gallery image',
        title: g.title || 'Gallery image',
        description: 'Life at United Bethel'
      }))
    : communityImages;

  const leftSources = galleryImages.length
    ? galleryImages.map((g) => ({
        src: g.url,
        alt: g.title || 'Gallery image',
        title: g.title || 'Gallery image',
        description: 'Our people and moments'
      }))
    : leftCardImages;

  const rightSources = galleryImages.length
    ? galleryImages.map((g) => ({
        src: g.url,
        alt: g.title || 'Gallery image',
        title: g.title || 'Gallery image',
        description: 'Community in action'
      }))
    : rightCardImages;

  // Auto-slide functionality for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroSources.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroSources.length]);

  // Auto-slide functionality for left card images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLeftImageIndex((prevIndex) => 
        prevIndex === leftSources.length - 1 ? 0 : prevIndex + 1
      );
    }, 3500); // Change left image every 3.5 seconds

    return () => clearInterval(interval);
  }, [leftSources.length]);

  // Auto-slide functionality for right card images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRightImageIndex((prevIndex) => 
        prevIndex === rightSources.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change right image every 4 seconds

    return () => clearInterval(interval);
  }, [rightSources.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === heroSources.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroSources.length - 1 : prevIndex - 1
    );
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => prevIndex === 1 ? 0 : prevIndex + 1);
  };

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => prevIndex === 0 ? 1 : prevIndex - 1);
  };

  const nextLeftImage = () => {
    setCurrentLeftImageIndex((prevIndex) => 
      prevIndex === leftCardImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevLeftImage = () => {
    setCurrentLeftImageIndex((prevIndex) => 
      prevIndex === 0 ? leftCardImages.length - 1 : prevIndex - 1
    );
  };

  const nextRightImage = () => {
    setCurrentRightImageIndex((prevIndex) => 
      prevIndex === rightCardImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevRightImage = () => {
    setCurrentRightImageIndex((prevIndex) => 
      prevIndex === 0 ? rightCardImages.length - 1 : prevIndex - 1
    );
  };

  const values = [
    {
      icon: Heart,
      title: 'Love & Compassion',
      description: 'We believe in showing Christ\'s love through our actions and words to everyone we meet.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong relationships and supporting one another through life\'s journey together.'
    },
    {
      icon: Book,
      title: 'Biblical Teaching',
      description: 'Grounded in Scripture, we seek to understand and apply God\'s word in our daily lives.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Making a difference locally and globally through missions and service opportunities.'
    }
  ];

  return (
    <section ref={ref} className={`py-20 bg-black/95 ${className}`} id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-4 sm:mb-6">
                Our <span className="text-white">Mission</span> & Values
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                For over 30 years, United Bethel Presbyterian Church has been a beacon of hope and faith in our neighborhood. 
                We're more than just a place of worship—we're a family united by our love for Christ and our 
                commitment to serving others.
              </p>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Our doors are open to everyone, regardless of where you are in your faith journey. Whether you're 
                taking your first steps or have been walking with Christ for years, you'll find a welcoming home here.
              </p>
              
              {/* Expandable Content */}
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-6">
                  <p className="text-lg text-white/80 leading-relaxed">
                    Our church family is built on the foundation of Presbyterian traditions, emphasizing the sovereignty of God, 
                    the authority of Scripture, and the importance of community. We believe that faith is not just a personal 
                    journey but a shared experience that strengthens us all.
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Through our various ministries, outreach programs, and community events, we strive to be a positive force 
                    in our neighborhood. From children's programs to senior care, from Bible studies to community service, 
                    we're committed to serving God by serving others.
                  </p>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Join us as we continue to grow in faith, deepen our relationships, and make a lasting impact in our 
                    community and beyond. Together, we can make a difference in the world around us.
                  </p>
                </div>
              </motion.div>
              
              {/* Read More/Less Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-300 font-medium mt-6"
              >
                {isExpanded ? (
                  <>
                    <span className="text-white">Read Less</span>
                    <ChevronUp className="h-4 w-4 text-white" />
                  </>
                ) : (
                  <>
                    <span className="text-white">Read More</span>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white/5 rounded-lg p-6 hover-elevate transition-all duration-300 border border-white/10">
                    <div className="flex items-center mb-3">
                      <div className="bg-white/10 p-2 rounded-lg mr-3 group-hover:bg-white/20 transition-colors duration-300">
                        <value.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-white">{value.title}</h3>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auto-Sliding Community Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="md:col-span-2 relative overflow-hidden rounded-2xl shadow-lg"
              >
                {/* Carousel Container */}
                <div className="relative h-[300px] overflow-hidden">
                  <motion.div
                    className="flex h-full"
                    animate={{ x: `-${currentImageIndex * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {heroSources.map((image, index) => (
                      <div key={index} className="w-full flex-shrink-0 relative">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-5" />
                        <div className="absolute bottom-4 left-4 text-white z-20 pointer-events-none">
                          <h3 className="font-serif text-xl font-semibold drop-shadow-lg">{image.title}</h3>
                          <p className="text-sm opacity-90 drop-shadow-md">{image.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-black" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-300"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-black" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {heroSources.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-black' : 'bg-black/50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Left Image Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative overflow-hidden rounded-2xl shadow-lg h-[300px]"
              >
                {/* Left Card Images Container */}
                <div className="relative h-full overflow-hidden">
                  <motion.div
                    className="flex h-full"
                    animate={{ x: `-${currentLeftImageIndex * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {leftSources.map((image, index) => (
                      <div key={index} className="w-full flex-shrink-0 relative">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-5" />
                        <div className="absolute bottom-4 left-4 text-white z-20 pointer-events-none">
                          <h3 className="font-serif text-xl font-semibold drop-shadow-lg">{image.title}</h3>
                          <p className="text-sm opacity-90 drop-shadow-md">{image.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Left Card Navigation Arrows */}
                  <button
                    onClick={prevLeftImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-1.5 transition-all duration-300"
                    aria-label="Previous left image"
                  >
                    <ChevronLeft className="h-3 w-3 text-black" />
                  </button>
                  <button
                    onClick={nextLeftImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-1.5 transition-all duration-300"
                    aria-label="Next left image"
                  >
                    <ChevronRight className="h-3 w-3 text-black" />
                  </button>

                  {/* Left Card Dots Indicator */}
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {leftCardImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentLeftImageIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          index === currentLeftImageIndex ? 'bg-black' : 'bg-black/50'
                        }`}
                        aria-label={`Go to left image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Image Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="relative overflow-hidden rounded-2xl shadow-lg h-[300px]"
              >
                {/* Right Card Images Container */}
                <div className="relative h-full overflow-hidden">
                  <motion.div
                    className="flex h-full"
                    animate={{ x: `-${currentRightImageIndex * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {rightSources.map((image, index) => (
                      <div key={index} className="w-full flex-shrink-0 relative">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-5" />
                        <div className="absolute bottom-4 left-4 text-white z-20 pointer-events-none">
                          <h3 className="font-serif text-xl font-semibold drop-shadow-lg">{image.title}</h3>
                          <p className="text-sm opacity-90 drop-shadow-md">{image.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Right Card Navigation Arrows */}
                  <button
                    onClick={prevRightImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-1.5 transition-all duration-300"
                    aria-label="Previous right image"
                  >
                    <ChevronLeft className="h-3 w-3 text-black" />
                  </button>
                  <button
                    onClick={nextRightImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-1.5 transition-all duration-300"
                    aria-label="Next right image"
                  >
                    <ChevronRight className="h-3 w-3 text-black" />
                  </button>

                  {/* Right Card Dots Indicator */}
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {rightCardImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentRightImageIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          index === currentRightImageIndex ? 'bg-black' : 'bg-black/50'
                        }`}
                        aria-label={`Go to right image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-card-border"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">30+</div>
                  <div className="text-xs text-muted-foreground">Years Serving</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground">Families</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}