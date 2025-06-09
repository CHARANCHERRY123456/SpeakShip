import React from 'react';
import useCustomerDeliveries from '../hooks/useCustomerDeliveries';

export default function CustomerDeliveriesList() {
  const { deliveries, loading, error } = useCustomerDeliveries();
  return (
    <div>
      <h2>My Delivery Requests</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {deliveries.map((d) => (
        <div key={d._id} className="delivery-card">
          <div><b>Name:</b> {d.name}</div>
          <div><b>Pickup:</b> {d.pickupAddress}</div>
          <div><b>Dropoff:</b> {d.dropoffAddress}</div>
          <div><b>Status:</b> {d.status}</div>
          {d.photoUrl && <img src={d.photoUrl} alt="Delivery" style={{ maxWidth: 200 }} />}
        </div>
      ))}
    </div>
  );
}
