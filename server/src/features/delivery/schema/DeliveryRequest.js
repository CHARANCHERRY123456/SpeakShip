import mongoose from 'mongoose';

const DeliveryRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: false,
      trim: true
    },
    packageName: {
      type: String,
      required: true,
      trim: true
    },
    pickupAddress: {
      type: String,
      required: true
    },
    dropoffAddress: {
      type: String,
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    photoUrl: {
      type: String,
      default: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'In-Transit', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    acceptedAt: {
      type: Date,
      default: null
    },
    deliveryTimeEstimate: {
      type: Date,
      default: null
    },
    isAutoAssigned: {
      type: Boolean,
      default: false
    },
    priceEstimate: {
      type: Number,
      default: 0
    },
    distanceInKm: {
      type: Number,
      default: 0
    },
    rejectionCount: {
      type: Number,
      default: 0
    },
    priorityLevel: {
      type: String,
      enum: ['Normal', 'Urgent', 'Overnight'],
      default: 'Normal'
    },
    deliveryOtp: {
      type: String,
      default: null
    }
  },
  {timestamps: true}
);

export default mongoose.model('DeliveryRequest', DeliveryRequestSchema);
