//src/features/profile/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { PROFILE_FIELDS } from '../constants/profileFields';
import profileApi from '../apis/profile';

export const useProfile = () => {
  const { currentUser: initialUser, isAuthenticated, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wrap fetchProfile in useCallback to prevent unnecessary recreations
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (isAuthenticated) {
        const profileData = await profileApi.getProfile();
        setCurrentUser(prev => ({ ...prev, ...profileData }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update profile function - removed useless catch
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      const updatedUser = await profileApi.updateProfile(updatedData);
      setCurrentUser(prev => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture - removed useless catch
  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      const { avatarUrl } = await profileApi.uploadProfilePicture(file);
      setCurrentUser(prev => ({ ...prev, avatar: avatarUrl }));
      return avatarUrl;
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile on mount - added fetchProfile to dependencies
  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  const getProfileFields = () => {
    return PROFILE_FIELDS.map(field => ({
      ...field,
      value: currentUser?.[field.id] || field.fallback || 'N/A'
    }));
  };

  return {
    currentUser,
    isAuthenticated,
    logout,
    profileFields: getProfileFields(),
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
    uploadProfilePicture
  };
};