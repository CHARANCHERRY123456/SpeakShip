import React from 'react';
import { motion } from 'framer-motion';
import { Package, Map, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <Package className="w-8 h-8" />,
    step: "1",
    title: "Schedule Pickup",
    description: "Book a pickup through our app or website in seconds"
  },
  {
    icon: <Map className="w-8 h-8" />,
    step: "2",
    title: "Track Delivery",
    description: "Follow your package in real-time on our interactive map"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    step: "3",
    title: "Receive Package",
    description: "Get instant notifications when your delivery arrives"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Simple steps to get your packages delivered fast and securely
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center"
            >
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.step}
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 pt-16 rounded-xl shadow-md hover:shadow-lg transition-shadow h-full">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;