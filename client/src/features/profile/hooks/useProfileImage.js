import { useState } from 'react';
import {
  uploadProfileImage,
  editProfileImage,
  removeProfileImage,
} from '../apis/profileImageApi';
import { PROFILE_IMAGE_UPLOAD_ERROR, PROFILE_IMAGE_EDIT_ERROR, PROFILE_IMAGE_REMOVE_ERROR } from '../constants/profileImageConstants';

export const useProfileImage = (initialUrl, token) => {
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setLoading(true);
    setError('');
    console.log('upload function called, file:', file);
    try {
      const data = await uploadProfileImage(file, token);
      setImageUrl(data.url);
      console.log('uploadProfileImage response:', data);
    } catch (err) {
      setError(PROFILE_IMAGE_UPLOAD_ERROR);
      console.error('uploadProfileImage error:', err);
    } finally {
      setLoading(false);
    }
  };

  const edit = async (file) => {
    setLoading(true);
    setError('');
    console.log('edit function called, file:', file);
    try {
      const data = await editProfileImage(file, token);
      setImageUrl(data.url);
      console.log('editProfileImage response:', data);
    } catch (err) {
      setError(PROFILE_IMAGE_EDIT_ERROR);
      console.error('editProfileImage error:', err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await removeProfileImage(token);
      setImageUrl(data.url);
    } catch {
      setError(PROFILE_IMAGE_REMOVE_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { imageUrl, loading, error, upload, edit, remove };
};
