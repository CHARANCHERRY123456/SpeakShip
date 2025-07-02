// src/features/profile/pages/ProfilePage.jsx
import React, { useState, useRef } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useProfileImage } from '../hooks/useProfileImage';
import ProfileCard from '../components/ProfileCard';
import ProfileHeader from '../components/ProfileHeader';
import ProfileField from '../components/ProfileField';
import ProfileActions from '../components/ProfileActions';
import ProfileImageUploader from '../components/ProfileImageUploader';
import { DEFAULT_PROFILE_IMAGE_URL } from '../constants/profileImageConstants';
import { Edit3 } from 'lucide-react';

const editableFields = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter your phone' },
];

const ProfilePage = () => {
  const { isAuthenticated, logout, profileFields, currentUser, updateProfile, token } = useProfile();
  // Use photoUrl for the image, fallback to default
  const { imageUrl, loading, error, upload, edit, remove } = useProfileImage(currentUser?.photoUrl || DEFAULT_PROFILE_IMAGE_URL, token);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState('');
  const [successProfile, setSuccessProfile] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef();

  React.useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser]);

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

  // Handler for toggling edit mode for profile details
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setErrorProfile('');
    setSuccessProfile('');
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    setErrorProfile('');
    setSuccessProfile('');
    try {
      await updateProfile(form);
      setSuccessProfile('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setErrorProfile(err.message || 'Failed to update profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handler for removing profile image
  const handleRemoveImage = async () => {
    await remove();
  };

  // Handler for uploading profile image
  const handleEditImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageLoading(true); // Show spinner
      await upload(file);
      setImageLoading(false); // Hide spinner
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProfileCard>
          <ProfileHeader
            user={{
              name: currentUser?.name || 'User',
              username: currentUser?.username || 'username',
              role: currentUser?.role || 'Member',
              email: currentUser?.email || 'No email provided',
              phone: currentUser?.phone || null,
              loading: imageLoading
            }}
            imageUrl={imageUrl}
            onEditToggle={handleEditToggle}
            onEditImage={handleEditImage}
            onRemoveImage={handleRemoveImage}
          />
          {/* Hidden file input for image upload */}
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {isEditing ? (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {editableFields.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <label htmlFor={field.id} className="text-sm font-semibold text-blue-700 mb-1">{field.label}</label>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    value={form[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm"
                    disabled={loadingProfile}
                  />
                </div>
              ))}
              <div className="col-span-full flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                  disabled={loadingProfile}
                >
                  {loadingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={handleEditToggle}
                  disabled={loadingProfile}
                >
                  Cancel
                </button>
              </div>
              {errorProfile && <div className="col-span-full text-red-600 font-medium mt-2">{errorProfile}</div>}
              {successProfile && <div className="col-span-full text-green-600 font-medium mt-2">{successProfile}</div>}
            </form>
          ) : (
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
          )}

          <ProfileActions onLogout={logout} />
        </ProfileCard>
      </div>
    </div>
  );
};

export default ProfilePage;