import React from 'react';
import { motion } from 'framer-motion';
import ContactCard from './ContactCard';

const ContactOptions = () => {
  const contactMethods = [
    {
      title: "Call us directly",
      content: "9838769817",
      isButton: false,
    },
    {
      title: "Chat with our team",
      buttonText: "Chat with team",
      isButton: true,
    },
    {
      title: "contact through mail",
      buttonText: "support@gmail.com",
      isButton: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
     <motion.h2
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-black mb-4 text-center"
>
  Get <span className="bg-gradient-to-r from-blue-500 to-blue-900 bg-clip-text text-transparent">In</span> Touch
</motion.h2>

           
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="transform transition-transform duration-500 hover:scale-105"
          >
            <ContactCard {...method} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactOptions;
