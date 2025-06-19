import React from 'react';
import { usePendingDeliveries } from '../hooks/usePendingDeliveries';
import PendingDeliveriesList from '../components/PendingDeliveriesList';

export default function DriverOrdersPage() {
  const { deliveries, loading, error, handleAccept } = usePendingDeliveries();

  if (loading) return <div>Loading pending deliveries...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Pending Deliveries</h2>
      <PendingDeliveriesList deliveries={deliveries} onAccept={handleAccept} />
    </div>
  );
}
