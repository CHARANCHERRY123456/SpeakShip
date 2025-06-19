// Shared grid component for displaying deliveries in a consistent layout
import React from 'react';

export default function DeliveryGrid({ deliveries, renderCard }) {
  if (!deliveries || deliveries.length === 0) {
    return <div>No deliveries found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {deliveries.map((delivery) => renderCard(delivery))}
    </div>
  );
}
