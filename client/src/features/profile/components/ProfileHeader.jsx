import React, { useState } from 'react';
import { User, Edit3, Settings, Trash2, Maximize2 } from 'lucide-react';
import { DEFAULT_PROFILE_IMAGE_URL } from '../constants/profileImageConstants';

const ProfileHeader = ({ user, imageUrl, onEditToggle, onSettingsClick, onEditImage, onRemoveImage }) => {
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

  const safeImageUrl = imageUrl || DEFAULT_PROFILE_IMAGE_URL;

  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

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
          <div className="relative cursor-pointer group" onClick={handleImageClick}>
            {safeImageUrl ? (
              <img
                src={safeImageUrl}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30 bg-white/20 group-hover:opacity-90 transition"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_PROFILE_IMAGE_URL;
                }}
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-4 border-white/30">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            {/* Fullscreen icon overlay */}
            <div className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow">
              <Maximize2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          {/* Modal for full image view */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="relative bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center">
                <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold">&times;</button>
                <img
                  src={safeImageUrl}
                  alt="Profile Full"
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover border-4 border-blue-200 mb-4"
                  onError={e => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_IMAGE_URL; }}
                />
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => { handleCloseModal(); onEditImage && onEditImage(); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow flex items-center justify-center"
                    aria-label="Edit profile image"
                  >
                    <Edit3 className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => { handleCloseModal(); onRemoveImage && onRemoveImage(); }}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow flex items-center justify-center"
                    aria-label="Remove profile image"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
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