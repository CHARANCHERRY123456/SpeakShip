import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ContactHeader = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="text-center mb-12 md:mb-16 px-4 sm:px-6 lg:px-8"
    >
     
       
        <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                     Contact <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent"> Speakship </span>Support
        </motion.h2>
     
      
      <motion.p 
        variants={itemVariants}
        className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto 
                  leading-relaxed transition-colors duration-300"
      >
        Our dedicated team is available 24/7 to assist with any delivery concerns. Whether you're tracking a package, 
        reporting a delivery issue, need help with returns, or have questions about our services, we're here to help. 
        Get in touch through any of these convenient options below.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="mt-8 mx-auto w-24 h-1 bg-blue-500 dark:bg-blue-400 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />
    </motion.div>
  );
};

export default ContactHeader;