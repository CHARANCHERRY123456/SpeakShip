import { useState } from 'react';
import {
  uploadProfileImage,
  editProfileImage,
  removeProfileImage,
} from '../apis/profileImageApi';
import { PROFILE_IMAGE_UPLOAD_ERROR, PROFILE_IMAGE_EDIT_ERROR, PROFILE_IMAGE_REMOVE_ERROR, DEFAULT_PROFILE_IMAGE_URL } from '../constants/profileImageConstants';
import { useAuth } from '../../../contexts/AuthContext';

export const useProfileImage = (initialUrl, token) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to update localStorage and AuthContext
  const updateUserPhotoUrl = (url) => {
    const safeUrl = url || DEFAULT_PROFILE_IMAGE_URL;
    setImageUrl(safeUrl);
    // Update localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.photoUrl = safeUrl;
        localStorage.setItem('user', JSON.stringify(userObj));
      }
    } catch (e) { /* ignore */ }
    // Update AuthContext
    if (setCurrentUser && currentUser) {
      setCurrentUser({ ...currentUser, photoUrl: safeUrl });
    }
  };

  const upload = async (file) => {
    setLoading(true);
    setError('');
    try {
      const data = await uploadProfileImage(file, token);
      updateUserPhotoUrl(data.url);
    } catch (err) {
      setError(PROFILE_IMAGE_UPLOAD_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const edit = async (file) => {
    setLoading(true);
    setError('');
    try {
      const data = await editProfileImage(file, token);
      updateUserPhotoUrl(data.url);
    } catch (err) {
      setError(PROFILE_IMAGE_EDIT_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await removeProfileImage(token);
      updateUserPhotoUrl(data.url);
    } catch {
      setError(PROFILE_IMAGE_REMOVE_ERROR);
      updateUserPhotoUrl(''); // fallback to default
    } finally {
      setLoading(false);
    }
  };

  return { imageUrl: imageUrl || DEFAULT_PROFILE_IMAGE_URL, loading, error, upload, edit, remove };
};
