// src/features/profile/components/ProfileActions.jsx
import React from 'react';

const ProfileActions = ({ onLogout }) => {
  return (
    <div className="flex justify-center items-center sm:min-h-0">
      <div className="w-full max-w-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={onLogout}
            className="w-full sm:w-auto px-6 py-2.5 text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
          >
            Sign Out
          </button>
          <button className="w-full sm:w-auto px-6 py-2.5 font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileActions;