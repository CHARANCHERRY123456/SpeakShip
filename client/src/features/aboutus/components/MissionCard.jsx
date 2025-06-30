import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import quickdelivery from '../assests/quickdelivery.png';

const MissionCard = () => {
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
      className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="md:flex gap-12 items-center">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={quickdelivery} 
              alt="Order Delivery Courier" 
              className="rounded-2xl w-full h-auto shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          <motion.div 
            className="md:w-1/2"
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Our <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Mission</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-gray-700 text-lg mb-6 leading-relaxed transition-colors duration-300"
            >
              At <span className="font-semibold text-blue-700">Speakship</span>, we're dedicated to making fast and reliable order deliveries a reality for everyone. 
              Our goal is to connect businesses and customers through an efficient, transparent, and secure platform.
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-gray-700 text-lg leading-relaxed transition-colors duration-300"
            >
              Whether you're sending packages across town or managing last-mile logistics, 
              we're here to ensure your deliveries arrive <span className="font-semibold text-blue-700">swiftly</span> and <span className="font-semibold text-blue-700">safely</span>, every time.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <Link
                to="/"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Learn More
                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionCard;