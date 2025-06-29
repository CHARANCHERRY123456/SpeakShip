import React from 'react';
import ContactHeader from './components/ContactHeader';
import ContactOptions from './components/ContactOptions';

const ContactUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ContactHeader />
      <ContactOptions />
    </div>
  );
};

export default ContactUs;