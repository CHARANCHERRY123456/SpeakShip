import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import StatsSection from './components/StatsSection';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';

const HomePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
    
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <StatsSection />
        <Testimonials />
        <CtaSection />
      </main>
   
    </motion.div>
  );
};

export default HomePage;