import React, { useState } from 'react';
import DeliveryCard from './DeliveryCard';

export default function PendingDeliveriesList({ deliveries, onAccept }) {
  const [acceptingId, setAcceptingId] = useState(null);

  if (!deliveries.length) return <div>No pending deliveries.</div>;

  return (
    <div className="pending-deliveries-list">
      {deliveries.map((delivery) => (
        <DeliveryCard
          key={delivery._id}
          delivery={delivery}
          onAccept={async (id) => {
            setAcceptingId(id);
            await onAccept(id);
            setAcceptingId(null);
          }}
          accepting={acceptingId === delivery._id}
        />
      ))}
    </div>
  );
}
