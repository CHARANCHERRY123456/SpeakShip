// Shared grid component for displaying deliveries in a consistent layout
import React from 'react';

export default function DeliveryGrid({ deliveries, renderCard }) {
  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l.4 2M7 10h10l1.4 2M17 10h2m-9 4h4m-2 0v2m0-2v-2m0 2h-2m2 0h2" /></svg>
        <div className="text-xl font-semibold text-gray-400 mb-2">No deliveries found.</div>
        <div className="text-gray-400 text-sm">You're all caught up! New deliveries will appear here.</div>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-2">
        {deliveries.map((delivery) => renderCard(delivery))}
      </div>
    </div>
  );
}
