import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-2xl mx-4 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Icon with animation */}
            <motion.div 
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"
                  variants={pulseVariants}
                  animate="animate"
                />
                <motion.div 
                  className="relative bg-blue-500 rounded-full p-6"
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Wrench className="h-16 w-16 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Status Code */}
            <motion.div 
              className="mb-4"
              variants={itemVariants}
            >
              <span className="text-6xl font-bold text-gray-900">503</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-3xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Under Maintenance
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg text-gray-600 mb-6 max-w-md mx-auto"
              variants={itemVariants}
            >
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back soon!
            </motion.p>

            {/* Icon List */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 text-gray-600"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Clock className="h-5 w-5" />
                <span className="text-sm">Scheduled Maintenance</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">We'll notify you when done</span>
              </motion.div>
            </motion.div>

            {/* Estimated Time */}
            <motion.div 
              className="mt-8 p-4 bg-blue-50 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm text-gray-700">
                <strong>Estimated completion:</strong> Please check back soon
              </p>
            </motion.div>

            {/* Contact Option */}
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => window.location.href = 'mailto:unitedbethelpresbyterian@gmail.com'}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

