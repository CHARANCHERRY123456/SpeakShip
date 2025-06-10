import { useState, useEffect } from 'react';
import { getCustomerDeliveries } from '../api';
import { useAuth } from '../../../contexts/AuthContext';

export default function useCustomerDeliveries() {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getCustomerDeliveries(token)
      .then(setDeliveries)
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch customer deliveries'))
      .finally(() => setLoading(false));
  }, [token]);

  return { deliveries, loading, error };
}
