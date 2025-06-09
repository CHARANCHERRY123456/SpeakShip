import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,     
    unique: true    
  },
  name: {
    type: String,
    required: true
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
  role : {
    type: String,
    enum: ['driver', 'admin'],
    default: 'driver'
  },
  phone: {
    type: String,
    match: /^\d{10}$/
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  },
  ordersInLine: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
});

const Driver = mongoose.model('Driver', DriverSchema);
export default Driver;

