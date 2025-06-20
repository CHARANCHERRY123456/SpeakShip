//src/features/profile/apis/profile.js
import axios from 'axios';

// For Vite projects, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const profileApi = {
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch profile';
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update profile';
    }
  },

  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axios.post(`${API_BASE_URL}/profile/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload profile picture';
    }
  }
};

export default profileApi;