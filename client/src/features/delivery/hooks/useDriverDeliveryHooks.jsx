import { useState, useEffect } from 'react';
import { getPendingDeliveries, acceptDeliveryRequest, getDriverDeliveries } from '../api';
import { useAuth } from '../../../contexts/AuthContext';

export function usePendingDeliveries() {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getPendingDeliveries(token)
      .then(setDeliveries)
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch deliveries'))
      .finally(() => setLoading(false));
  }, [token]);

  return { deliveries, loading, error };
}

export function useAcceptDelivery() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const accept = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await acceptDeliveryRequest(id, token);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept delivery');
    } finally {
      setLoading(false);
    }
  };

  return { accept, loading, error, success };
}

export function useDriverDeliveries() {
  const { token } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getDriverDeliveries(token)
      .then(setDeliveries)
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch driver deliveries'))
      .finally(() => setLoading(false));
  }, [token]);

  return { deliveries, loading, error };
}
