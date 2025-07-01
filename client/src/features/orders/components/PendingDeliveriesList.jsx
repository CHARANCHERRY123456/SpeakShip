import React, { useState } from 'react';
import DeliveryCard from './DeliveryCard';
import DeliveryGrid from '../../delivery/components/DeliveryCard/components/DeliveryGrid';

export default function PendingDeliveriesList({ deliveries, onAccept }) {
  const [acceptingId, setAcceptingId] = useState(null);

  return (
    <DeliveryGrid
      deliveries={deliveries}
      renderCard={(delivery) => (
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
      )}
    />
  );
}
