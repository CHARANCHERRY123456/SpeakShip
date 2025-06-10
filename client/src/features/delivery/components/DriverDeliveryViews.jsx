import React from 'react';
import { usePendingDeliveries, useAcceptDelivery, useDriverDeliveries } from '../hooks/useDriverDeliveryHooks';

export function PendingDeliveriesList() {
  const { deliveries, loading, error } = usePendingDeliveries();
  const { accept, loading: acceptLoading, error: acceptError, success } = useAcceptDelivery();

  return (
    <div>
      <h2>Pending Delivery Requests</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {deliveries.map((d) => (
        <div key={d._id} className="delivery-card">
          <div><b>Name:</b> {d.name}</div>
          <div><b>Email:</b> {d.email}</div>
          <div><b>Phone:</b> {d.phone}</div>
          <div><b>Pickup:</b> {d.pickupAddress}</div>
          <div><b>Dropoff:</b> {d.dropoffAddress}</div>
          <div><b>Note:</b> {d.note}</div>
          {d.photoUrl && <img src={d.photoUrl} alt="Delivery" style={{ maxWidth: 200 }} />}
          <button onClick={() => accept(d._id)} disabled={acceptLoading}>Accept</button>
        </div>
      ))}
      {acceptError && <div className="error">{acceptError}</div>}
      {success && <div className="success">Accepted!</div>}
    </div>
  );
}

export function DriverDeliveriesStack() {
  const { deliveries, loading, error } = useDriverDeliveries();
  return (
    <div>
      <h2>My Deliveries</h2>
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
