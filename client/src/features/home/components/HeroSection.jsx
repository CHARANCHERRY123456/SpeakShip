import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PrimaryButton from './shared/PrimaryButton';
import SecondaryButton from './shared/SecondaryButton';

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const gradientVariants = {
    hidden: { backgroundPosition: '0% 50%' },
    visible: {
      backgroundPosition: '100% 50%',
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        delay: 0.3,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Animated background elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden -z-10"
      >
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-[120%] h-[150%] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-full opacity-50"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              variants={titleVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              <motion.span className="block" variants={itemVariants}>
                Fast, Reliable
              </motion.span>
              <motion.span 
                className="bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent"
                variants={gradientVariants}
                style={{ backgroundSize: '200% 200%' }}
              >
                Delivery Services
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg"
            >
              Get your packages delivered in record time with our AI-powered logistics platform. 
              Real-time tracking, secure handling, and 24/7 support.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link to="/login">
                <PrimaryButton 
                  className="px-8 py-3 text-lg"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </PrimaryButton>
              </Link>
            </motion.div>

           
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                alt="Delivery service"
                className="w-full rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              
              
            </div>

            {/* Decorative animated elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;