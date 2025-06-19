import { useState, useEffect, useCallback } from 'react';
import { fetchPendingDeliveries, acceptDelivery } from '../api';
import { toast } from 'react-hot-toast';

export function usePendingDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingDeliveries();
      setDeliveries(data.results || []);
    } catch (e) {
      setError('Failed to load pending deliveries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (deliveryId) => {
    try {
      await acceptDelivery(deliveryId);
      setDeliveries((prev) => prev.filter((d) => d._id !== deliveryId));
      toast.success('Delivery accepted!');
    } catch (e) {
      toast.error('Failed to accept delivery.');
    }
  };

  return { deliveries, loading, error, reload: load, handleAccept };
}
