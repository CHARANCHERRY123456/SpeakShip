import React from 'react';
import DeliveryForm from '../components/DeliveryForm';
import CustomerDeliveriesList from '../components/CustomerDeliveriesList';

export default function CustomerDeliveryPage() {
  return (
    <div>
      <h1>Create Delivery Request</h1>
      <DeliveryForm />
      <hr style={{ margin: '2rem 0' }} />
      <CustomerDeliveriesList />
    </div>
  );
}
