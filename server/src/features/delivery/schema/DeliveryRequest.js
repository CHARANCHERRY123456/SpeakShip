import mongoose from 'mongoose';

const DeliveryRequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  note: { type: String },
  photoUrl: { type: String }, // Optional, store file path or URL
  status: { type: String, enum: ['Pending', 'Accepted', 'Completed'], default: 'Pending' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Assigned driver
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('DeliveryRequest', DeliveryRequestSchema);
