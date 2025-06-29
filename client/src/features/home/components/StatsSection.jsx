import React from 'react';
import { motion } from 'framer-motion';
import { Package, Users, Clock, Star, Truck, CheckCircle } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Package className="w-8 h-8" />,
      value: "50K+",
      label: "Deliveries",
      description: "Completed with 99.8% success rate",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "10K+",
      label: "Customers",
      description: "Served across 15+ cities",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: "<30 min",
      label: "Avg. Delivery",
      description: "Fastest in the industry",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.9/5",
      label: "Rating",
      description: "Based on 2K+ reviews",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-28 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-80"></div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10 dark:bg-blue-900/10"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              x: [0, Math.random() * 40 - 20],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Why Businesses<span className="bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">Trust Us</span>
          </motion.h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Delivering excellence through numbers and customer satisfaction
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              
              <div className="relative z-10 h-full bg-white dark:!bg-white rounded-xl shadow-lg dark:shadow-gray-800/20 p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 dark:border-gray-200">
                <div className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center bg-gradient-to-r ${stat.color} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:!text-gray-800 mb-2 transition-colors duration-300">
                  {stat.value}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 dark:!text-gray-700 mb-2 transition-colors duration-300">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-600 dark:!text-gray-600 transition-colors duration-300">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((item) => (
                <motion.img
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + item * 0.1 }}
                  src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 20}.jpg`}
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-200"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">Trusted by 10K+ customers</div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">4.9/5 rating</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">99.8% Success Rate</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;