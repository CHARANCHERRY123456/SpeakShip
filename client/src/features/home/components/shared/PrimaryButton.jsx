import React from 'react';
import { motion } from 'framer-motion';

const PrimaryButton = ({ children, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-gradient-to-r from-blue-600 to-blue-900 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default PrimaryButton;