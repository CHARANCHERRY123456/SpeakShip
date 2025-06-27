import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PrimaryButton from './shared/PrimaryButton';

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Fast Delivery?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust QuickDelivery with their packages.
          </p>
          <Link to="/auth">
            <PrimaryButton className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
              Get Started Now
            </PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;