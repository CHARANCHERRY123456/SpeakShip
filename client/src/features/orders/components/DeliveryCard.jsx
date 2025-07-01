// Extends DeliveryCard from delivery feature, adds Accept button for drivers
import React from 'react';
import BaseDeliveryCard from '../../delivery/components/DeliveryCard/DeliveryCard';

export default function DeliveryCard({ delivery, onAccept, accepting }) {
  return (
    <BaseDeliveryCard
      delivery={delivery}
      isDriverView={true}
      onAccept={onAccept}
      updateLoading={accepting}
    />
  );
}
