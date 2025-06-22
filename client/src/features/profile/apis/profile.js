//src/features/profile/apis/profile.js
import axiosClient from '../../../api/axios';

// For Vite projects, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const profileApi = {
  getProfile: async () => {
    try {
      const response = await axiosClient.get(`/api/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axiosClient.put(`/api/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await axiosClient.post(`/api/profile/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload profile picture';
    }
  }
};

export default profileApi;