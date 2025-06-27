// src/features/auth/schema/Customer.js
// This file defines the Customer schema for MongoDB using Mongoose.
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: false, // Allow Google OAuth users to register without a password
  },
  phone: {
    type: String,
    required: false,
    match: /^\d{10}$/
  },
  role : {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
    required: true
  },
  image: {
    type: String,
    required: false,
    default: ''
  },
  address: {
    type: String,
    required: false,
    default: ''
  },
  photoUrl: {
    type: String,
    default: 'https://i.pinimg.com/736x/cf/3f/5c/cf3f5c9f2d8362f9111cf7f7c93cf42f.jpg' 
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  wishlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist',
    required: false
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  coupans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupan',
    required: false
  }]
});

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
