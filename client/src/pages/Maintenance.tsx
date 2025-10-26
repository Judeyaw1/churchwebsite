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
        {/* Floating circles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-xl"
            style={{
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25
              ],
              y: [
                Math.random() * 50 - 25,
                Math.random() * 50 - 25,
                Math.random() * 50 - 25
              ],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-4xl mx-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header with rotating icon */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="inline-block mb-8"
              animate={floatAnimation}
            >
              <div className="relative inline-block">
                {/* Outer rotating ring */}
                <motion.div
                  className="absolute inset-0 border-4 border-purple-400 rounded-full"
                  style={{
                    width: 120,
                    height: 120,
                    top: "50%",
                    left: "50%",
                    marginTop: -60,
                    marginLeft: -60,
                    borderStyle: "dashed"
                  }}
                  animate={rotateAnimation}
                />
                
                {/* Inner icon */}
                <motion.div
                  className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-6 w-24 h-24 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wrench className="h-12 w-12 text-white" />
                </motion.div>

                {/* Glowing orbs around icon */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-blue-400 blur-md"
                    style={{
                      width: 20,
                      height: 20,
                      top: "50%",
                      left: "50%",
                      marginTop: -10,
                      marginLeft: -10,
                      transform: `rotate(${i * 90}deg) translateX(60px)`,
                      transformOrigin: "10px 10px"
                    }}
                    animate={pulseAnimation}
                  />
                ))}
              </div>
            </motion.div>

            {/* Status Code */}
            <motion.div
              className="mb-6"
              variants={itemVariants}
            >
              <div className="relative inline-block">
                <motion.span
                  className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
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
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Under Maintenance
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back soon with exciting updates!
            </motion.p>
          </motion.div>

          {/* Animated progress bar */}
          <motion.div
            className="mb-12"
            variants={itemVariants}
          >
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700">75%</span>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
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
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200"
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
              >
                <feature.icon className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
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
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Us for Updates
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
