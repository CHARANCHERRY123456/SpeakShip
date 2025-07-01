import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Shield, Clock, Users, Zap, Award } from 'lucide-react';

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Average delivery time of just 30 minutes with our optimized routing system',
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      description:
        'Real-time GPS tracking with live updates and delivery notifications',
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description:
        'End-to-end insurance coverage and background-verified drivers',
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description:
        'Round-the-clock delivery service available every day of the year',
    },
    {
      icon: Users,
      title: 'Trusted Drivers',
      description:
        'All drivers are verified, trained, and rated by our community',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description:
        'Award-winning service with industry-leading satisfaction rates',
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-black mb-4"
          >
            Why Choose <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">QuickDelivery</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-black max-w-3xl mx-auto"
          >
            We combine cutting-edge technology with human care to deliver your packages safely, quickly, and reliably every single time.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white dark:!bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2 border border-gray-100 dark:border-gray-200 hover:border-blue-100 dark:hover:border-blue-200">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:!text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:!text-gray-700 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;