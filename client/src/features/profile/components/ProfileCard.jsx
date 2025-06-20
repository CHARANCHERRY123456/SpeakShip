// src/features/profile/components/ProfileCard.jsx
import React from 'react';

const ProfileCard = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm transition-all duration-300 ease-in-out w-full max-w-3xl mx-auto overflow-hidden md:p-8">
      {children}
    </div>
  );
};

export default ProfileCard;