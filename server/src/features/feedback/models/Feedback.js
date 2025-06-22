// src/features/feedback/models/Feedback.js
import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

// Enforce one review per delivery per customer
FeedbackSchema.index({ deliveryId: 1, customerId: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
