import mongoose from 'mongoose';
import { DEFAULT_PROFILE_IMAGE_URL } from '../../../constants/globalConstants.js';

// Ensure Admin schema is present and correct for admin registrations
const AdminSchema = new mongoose.Schema({
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
    required: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  photoUrl: {
    type: String,
    default: DEFAULT_PROFILE_IMAGE_URL
  },
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
