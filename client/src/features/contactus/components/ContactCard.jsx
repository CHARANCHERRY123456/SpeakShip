import React from 'react';

const ContactCard = ({ title, content, buttonText, isButton }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      {isButton ? (
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">
          {buttonText}
        </button>
      ) : (
        <p className="text-lg text-gray-700 font-medium py-3 text-center">
          {content}
        </p>
      )}
    </div>
  );
};

export default ContactCard;