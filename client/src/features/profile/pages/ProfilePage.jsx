// src/features/profile/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileCard from '../components/ProfileCard';
import ProfileHeader from '../components/ProfileHeader';
import ProfileField from '../components/ProfileField';
import ProfileActions from '../components/ProfileActions';

const editableFields = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
  { id: 'phone', label: 'Phone', type: 'tel', placeholder: 'Enter your phone' },
];

const ProfilePage = () => {
  const { isAuthenticated, logout, profileFields, currentUser, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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
              phone: currentUser?.phone || null
            }}
            onEditToggle={handleEditToggle}
            isEditing={isEditing}
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
                    disabled={loading}
                  />
                </div>
              ))}
              <div className="col-span-full flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
              {error && <div className="col-span-full text-red-600 font-medium mt-2">{error}</div>}
              {success && <div className="col-span-full text-green-600 font-medium mt-2">{success}</div>}
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