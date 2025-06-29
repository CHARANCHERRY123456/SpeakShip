import React from 'react';
import ContactCard from './ContactCard';

const ContactOptions = () => {
  const contactMethods = [
    {
      title: "Call us directly",
      content: "+442035140663",
      isButton: false
    },
    {
      title: "Chat with our sales team",
      buttonText: "Chat with Sales",
      isButton: true
    },
    {
      title: "Get a product demo",
      buttonText: "Get a demo",
      isButton: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contactMethods.map((method, index) => (
        <ContactCard key={index} {...method} />
      ))}
    </div>
  );
};

export default ContactOptions;