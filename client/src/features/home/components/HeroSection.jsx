import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PrimaryButton from './shared/PrimaryButton';
import SecondaryButton from './shared/SecondaryButton';
import homepage from '../Assests/homepage.jpeg';

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

  // New: Floating elements animation
  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
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

      {/* Decorative floating circles */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 overflow-hidden -z-10"
      >
        <motion.div
          variants={floatingVariants}
          animate="float"
          className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-blue-500/10 blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          style={{ animationDelay: '1s' }}
          className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-purple-500/10 blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="float"
          style={{ animationDelay: '2s' }}
          className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full bg-indigo-500/10 blur-xl"
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
              <Link to="/about">
                <SecondaryButton 
                  className="px-8 py-3 text-lg"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </SecondaryButton>
              </Link>
            </motion.div>

            {/* Floating callout */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="mt-8 p-4 bg-blue-50/70 dark:bg-gray-800/60 rounded-xl inline-flex items-center gap-3 border border-blue-100 dark:border-gray-700 shadow-sm"
            >
              <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                !
              </span>
              <span className="text-sm md:text-base font-medium text-blue-800 dark:text-blue-300">
                Over 10,000 deliveries completed!
              </span>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img
                src={homepage}
                alt="Fast delivery service with a delivery person on a bike"
                className="w-full rounded-2xl shadow-xl group-hover:scale-[1.02] transition-transform duration-500 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              {/* Decorative badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md flex items-center gap-2"
              >
                <span className="text-xs font-bold text-blue-600">30 min</span>
                <span className="text-xs text-gray-600">Avg. Delivery</span>
              </motion.div>
            </div>

            {/* Decorative animated elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
