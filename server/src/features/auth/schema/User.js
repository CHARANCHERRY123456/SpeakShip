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
    required: true,
  },
  phone: {
    type: String,
    required: false,
    match: /^\d{10}$/
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'driver'],
    default: 'user'
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