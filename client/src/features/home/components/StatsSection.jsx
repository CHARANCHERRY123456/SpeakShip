import React from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Clock, Star } from 'lucide-react';

const stats = [
  {
    icon: <Package className="w-10 h-10" />,
    value: "50K+",
    label: "Deliveries"
  },
  {
    icon: <Users className="w-10 h-10" />,
    value: "10K+",
    label: "Customers"
  },
  {
    icon: <Clock className="w-10 h-10" />,
    value: "<30 min",
    label: "Avg. Delivery"
  },
  {
    icon: <Star className="w-10 h-10" />,
    value: "4.9/5",
    label: "Rating"
  }
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;