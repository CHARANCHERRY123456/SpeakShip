import React, { useRef } from 'react';
import useCreateDelivery from '../hooks/useCreateDelivery';

export default function DeliveryForm() {
  const { create, loading, error, success } = useCreateDelivery();
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    create(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" className="delivery-form">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone Number" required />
      <input name="pickupAddress" placeholder="Pickup Address" required />
      <input name="dropoffAddress" placeholder="Dropoff Address" required />
      <textarea name="note" placeholder="Short Note (optional)" />
      <input name="photo" type="file" accept="image/*" />
      <button type="submit" disabled={loading}>Create Delivery</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Delivery request created!</div>}
    </form>
  );
}
