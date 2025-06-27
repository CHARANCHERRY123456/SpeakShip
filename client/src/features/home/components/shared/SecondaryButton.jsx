import React from 'react';
import { motion } from 'framer-motion';

const SecondaryButton = ({ children, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default SecondaryButton;