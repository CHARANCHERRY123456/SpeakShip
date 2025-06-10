import React from 'react';
import { PendingDeliveriesList, DriverDeliveriesStack } from '../components/DriverDeliveryViews';

export default function DriverDeliveryPage() {
  return (
    <div>
      <h1>Available Delivery Requests</h1>
      <PendingDeliveriesList />
      <hr style={{ margin: '2rem 0' }} />
      <DriverDeliveriesStack />
    </div>
  );
}
