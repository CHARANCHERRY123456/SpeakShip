import React from 'react';
import { FaPhone, FaComments, FaDesktop, FaMailBulk } from 'react-icons/fa'; // Import icons for phone, chat, and demo

const icons = {
  "Call us directly": <FaPhone size={24} className="text-blue-600 mb-4" />,
  "Chat with our team": <FaComments size={24} className="text-blue-600 mb-4" />,
  "contact through mail": <FaMailBulk size={24} className="text-blue-600 mb-4" />,
};

const ContactCard = ({ title, content, buttonText, isButton }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group min-h-[200px] flex flex-col justify-between">
      <div className="flex flex-col items-center">
        {icons[title]}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
      </div>
      {isButton ? (
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
          {buttonText}
        </button>
      ) : (
        <p className="text-lg text-gray-700 font-medium py-3 text-center group-hover:text-blue-600 transition-colors duration-300">
          {content}
        </p>
      )}
    </div>
  );
};

export default ContactCard;
