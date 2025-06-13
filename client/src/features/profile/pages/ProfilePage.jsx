// src/features/profile/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Mail, Phone, Tag } from 'lucide-react'; // Importing icons

const ProfilePage = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="text-center py-12 text-red-600 font-semibold text-lg">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">My Profile</h1>

        <div className="space-y-4">
          <div className="flex items-center bg-gray-50 p-4 rounded-md shadow-sm">
            <Tag className="h-6 w-6 text-sky-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Role</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{currentUser.role}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-md shadow-sm">
            <User className="h-6 w-6 text-sky-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">{currentUser.name || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-md shadow-sm">
            <Mail className="h-6 w-6 text-sky-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Email Address</p>
              <p className="text-lg font-semibold text-gray-800">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-md shadow-sm">
            <User className="h-6 w-6 text-sky-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Username</p>
              <p className="text-lg font-semibold text-gray-800">{currentUser.username}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-4 rounded-md shadow-sm">
            <Phone className="h-6 w-6 text-sky-600 mr-4" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Phone Number</p>
              <p className="text-lg font-semibold text-gray-800">{currentUser.phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-8 py-3 px-6 rounded-lg bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
