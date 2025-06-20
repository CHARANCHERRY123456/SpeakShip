// src/features/profile/pages/ProfilePage.jsx
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileCard from '../components/ProfileCard';
import ProfileHeader from '../components/ProfileHeader';
import ProfileField from '../components/ProfileField';
import ProfileActions from '../components/ProfileActions';

const ProfilePage = () => {
  const { isAuthenticated, logout, profileFields, currentUser } = useProfile(); // Changed from user to currentUser

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ProfileCard>
          <ProfileHeader 
            user={{
              name: "Guest User",
              username: "guest",
              role: "Visitor",
              email: "Please sign in"
            }}
          />
        </ProfileCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProfileCard>
          <ProfileHeader 
            user={{
              name: currentUser?.name || 'User', // Changed from user to currentUser
              username: currentUser?.username || 'username',
              role: currentUser?.role || 'Member',
              email: currentUser?.email || 'No email provided',
              phone: currentUser?.phone || null
            }}
            onEditToggle={() => console.log('Edit toggled')}
            isEditing={false}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {profileFields.map((field) => (
              <ProfileField
                key={field.id}
                label={field.label}
                value={field.transform ? field.transform(field.value) : field.value}
                icon={field.icon}
              />
            ))}
          </div>

          <ProfileActions onLogout={logout} />
        </ProfileCard>
      </div>
    </div>
  );
};

export default ProfilePage;