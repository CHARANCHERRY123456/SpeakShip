import { useState } from 'react';
import { createDeliveryRequest } from '../api';
import { useAuth } from '../../../contexts/AuthContext';

export default function useCreateDelivery() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const create = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createDeliveryRequest(formData, token);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create delivery request');
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, success };
}
