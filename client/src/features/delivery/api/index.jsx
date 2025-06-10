// API functions for delivery feature
import axios from '../../../api/axios';

export const createDeliveryRequest = async (formData, token) => {
  const res = await axios.post('/delivery/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getPendingDeliveries = async (token) => {
  const res = await axios.get('/delivery/pending', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const acceptDeliveryRequest = async (id, token) => {
  const res = await axios.post(`/delivery/accept/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getDriverDeliveries = async (token) => {
  const res = await axios.get('/delivery/my', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getCustomerDeliveries = async (token) => {
  const res = await axios.get('/delivery/customer', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
