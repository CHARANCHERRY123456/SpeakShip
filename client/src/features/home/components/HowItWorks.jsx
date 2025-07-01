import React from 'react';
import { motion } from 'framer-motion';
import { Package, Map, CheckCircle, Clock, Check, Truck, Box, X } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Package size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />,
      title: "Schedule Pickup",
      description: "Book your pickup in seconds",
      status: "Pending",
      color: "bg-blue-500"
    },
    {
      icon: <Map size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />,
      title: "Track Delivery",
      description: "Real-time package tracking",
      status: "In-Transit",
      color: "bg-purple-500"
    },
    {
      icon: <CheckCircle size={24} className="sm:w-6 sm:h-6 md:w-8 md:h-8" />,
      title: "Receive Package",
      description: "Get delivery notifications",
      status: "Delivered",
      color: "bg-green-500"
    }
  ];

  const allStatuses = [
    { name: "Pending", icon: <Clock size={16} className="w-4 h-4" />, color: "bg-gray-400" },
    { name: "Accepted", icon: <Check size={16} className="w-4 h-4" />, color: "bg-blue-400" },
    { name: "In-Transit", icon: <Truck size={16} className="w-4 h-4" />, color: "bg-yellow-400" },
    { name: "Delivered", icon: <Box size={16} className="w-4 h-4" />, color: "bg-green-400" },
    { name: "Canceled", icon: <X size={16} className="w-4 h-4" />, color: "bg-red-400" }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const statusDot = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "backOut"
      }
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-white px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-black mb-3 sm:mb-4"
          >
            Delivery <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Process</span> Steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-black max-w-3xl mx-auto"
          >
            Simple steps from pickup to delivery
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step, index) => {
            const statusIndex = allStatuses.findIndex(s => s.name === step.status);
            const progressWidth = `${(statusIndex + 1) * 20}%`;

            return (
              <motion.div
                key={index}
                variants={item}
                className="bg-white dark:bg-white p-6 sm:p-7 md:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-200"
              >
                {/* Step Header */}
                <div className={`${step.color} w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4 sm:mb-5 md:mb-6 shadow-md`}>
                  {step.icon}
                </div>

                <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-center mb-2 sm:mb-3 text-gray-900 dark:text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-700 text-center mb-6 sm:mb-7 md:mb-8">
                  {step.description}
                </p>

                {/* Status */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-600 text-center mb-1 sm:mb-2">
                    Current Status:
                  </p>
                  <div className="flex justify-center">
                    <span className={`px-2 py-1 text-xs sm:text-sm rounded-full text-white ${allStatuses[statusIndex].color} shadow-md`}>
                      {step.status}
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6 sm:mt-7 md:mt-8">
                  <div className="relative h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-300 rounded-full mb-8 sm:mb-9 md:mb-10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: progressWidth }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                      className={`absolute top-0 left-0 h-full ${step.color} rounded-full`}
                    />
                  </div>

                  <div className="flex justify-between gap-x-0.5 sm:gap-x-1">
                    {allStatuses.map((status, idx) => (
                      <motion.div
                        key={idx}
                        variants={statusDot}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${status.color} rounded-full flex items-center justify-center text-white mb-1 sm:mb-2 shadow-md`}>
                          {status.icon}
                        </div>
                        <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-600 text-center leading-tight">
                          {status.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;