import React from "react";
import { motion } from "framer-motion";
import { Wrench, Clock, Mail, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  // Animation variants for entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Continuous rotation animation
  const rotateAnimation = {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  };

  // Continuous floating animation
  const floatAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Pulsing animation
  const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Shimmer animation
  const shimmerAnimation = {
    x: ["-100%", "100%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles - fixed positions for consistent rendering */}
        {[200, 150, 180, 120, 160, 140].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-xl"
            style={{
              width: size,
              height: size,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              x: [-15, 15, -15],
              y: [-10, 15, -10],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-2xl mx-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Header with rotating icon */}
          <motion.div
            className="text-center mb-6"
            variants={itemVariants}
          >
            <motion.div
              className="inline-block mb-4"
              animate={floatAnimation}
            >
              <div className="relative inline-block">
                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0 border-purple-400 rounded-full md:border-4"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderWidth: "2px",
                    top: "50%",
                    left: "50%",
                    marginTop: "-50px",
                    marginLeft: "-50px",
                    borderStyle: "dashed"
                  }}
                  animate={rotateAnimation}
                />
                
                {/* Inner icon */}
                <motion.div
                  className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 md:p-5 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wrench className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </motion.div>

                {/* Glowing orbs around icon */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-blue-400 blur-md hidden md:block"
                    style={{
                      width: 20,
                      height: 20,
                      top: "50%",
                      left: "50%",
                      marginTop: -10,
                      marginLeft: -10,
                      transform: `rotate(${i * 90}deg) translateX(40px)`,
                      transformOrigin: "10px 10px"
                    }}
                    animate={pulseAnimation}
                  />
                ))}
              </div>
            </motion.div>

            {/* Status Code */}
            <motion.div
              className="mb-4"
              variants={itemVariants}
            >
              <div className="relative inline-block">
                <motion.span
                  className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    delay: 0.8
                  }}
                >
                  503
                </motion.span>
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{ width: "200%", height: "100%" }}
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Under Maintenance
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-gray-600 mb-6 max-w-xl mx-auto px-2"
              variants={itemVariants}
            >
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back soon!
            </motion.p>
          </motion.div>

          {/* Animated progress bar */}
          <motion.div
            className="mb-6"
            variants={itemVariants}
          >
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{
                  width: "75%",
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            variants={itemVariants}
          >
            {[
              {
                icon: Settings,
                title: "Improving Experience",
                description: "Enhancing features"
              },
              {
                icon: Clock,
                title: "Estimated Time",
                description: "1-2 hours"
              },
              {
                icon: Mail,
                title: "Updates",
                description: "We'll notify you"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-purple-200"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
              >
                <feature.icon className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Button */}
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                onClick={() => window.location.href = 'mailto:unitedbethelpresbyterian@gmail.com'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-semibold rounded-lg shadow-lg w-full md:w-auto"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
