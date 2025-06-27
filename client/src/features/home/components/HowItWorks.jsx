import React from 'react';
import { motion } from 'framer-motion';
import { Package, Map, CheckCircle, Clock, Check, Truck, Box, X } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Package size={32} />,
      title: "Schedule Pickup",
      description: "Book your pickup in seconds",
      status: "Pending",
      color: "bg-blue-500"
    },
    {
      icon: <Map size={32} />,
      title: "Track Delivery",
      description: "Real-time package tracking",
      status: "In-Transit",
      color: "bg-purple-500"
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Receive Package",
      description: "Get delivery notifications",
      status: "Delivered",
      color: "bg-green-500"
    }
  ];

  const allStatuses = [
    { name: "Pending", icon: <Clock size={20} />, color: "bg-gray-400" },
    { name: "Accepted", icon: <Check size={20} />, color: "bg-blue-400" },
    { name: "In-Transit", icon: <Truck size={20} />, color: "bg-yellow-400" },
    { name: "Delivered", icon: <Box size={20} />, color: "bg-green-400" },
    { name: "Canceled", icon: <X size={20} />, color: "bg-red-400" }
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
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Delivery <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">Process</span> Steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Simple steps from pickup to delivery
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => {
            const statusIndex = allStatuses.findIndex(s => s.name === step.status);
            const progressWidth = `${(statusIndex + 1) * 20}%`;

            return (
              <motion.div
                key={index}
                variants={item}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                {/* Step Header */}
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-md`}>
                  {step.icon}
                </div>

                <h3 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">{step.description}</p>

                {/* Status */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
                    Current Status:
                  </p>
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-white ${allStatuses[statusIndex].color} shadow-md`}>
                      {step.status}
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-8">
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: progressWidth }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                      className={`absolute top-0 left-0 h-2 ${step.color} rounded-full`}
                    />
                  </div>

                  {/* Add gap-x-2 here! */}
                  <div className="flex justify-between gap-x-1">
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
                        <div className={`w-8 h-8 ${status.color} rounded-full flex items-center justify-center text-white mb-2 shadow-md`}>
                          {status.icon}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{status.name}</span>
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
