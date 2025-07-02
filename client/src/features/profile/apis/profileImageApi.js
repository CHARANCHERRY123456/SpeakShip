import axios from '../../../api/axios';

export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post('/api/profile/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const editProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.put('/api/profile/edit-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const removeProfileImage = async () => {
  const res = await axios.delete('/api/profile/remove-image');
  return res.data;
};
