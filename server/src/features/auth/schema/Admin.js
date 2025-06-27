import mongoose from 'mongoose';

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
    default: 'https://i.pinimg.com/736x/cf/3f/5c/cf3f5c9f2d8362f9111cf7f7c93cf42f.jpg' 
  },
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
