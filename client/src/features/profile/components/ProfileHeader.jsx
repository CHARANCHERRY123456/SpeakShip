import React from 'react';
import { User, Edit3, Settings } from 'lucide-react';

const ProfileHeader = ({ user, imageUrl, onEditToggle, onSettingsClick }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'customer':  return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'driver': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'admin': return 'bg-rose-50 text-rose-800 border-rose-200'; 
      default: return 'bg-green-100 text-gray-800 border-green-200';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30 bg-white/20"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 border-white/30">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center">
            <div className="flex flex-col items-center sm:flex-row sm:justify-center gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user?.name || 'User'}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user?.role)}`}>
                {user?.role || 'User'}
              </span>
            </div>
            <p className="text-blue-100 text-sm sm:text-base mb-4">
              @{user?.username}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 text-sm text-blue-100">
              <span>✉️ {user?.email}</span>
              {user?.phone && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>📱 {user?.phone}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-center sm:justify-start">
            <button
              onClick={onEditToggle}
              className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 group"
              aria-label="Edit profile"
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={onSettingsClick}
              className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 group"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;