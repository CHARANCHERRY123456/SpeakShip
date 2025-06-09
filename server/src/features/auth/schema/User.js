// src/features/auth/schema/User.js
// This file defines the User schema for MongoDB using Mongoose.
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['customer', 'admin', 'driver'],
    default: 'customer'
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

const User =  mongoose.model('User', UserSchema);
export default User;