// src/features/auth/schema/Otp.js
import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Only one active OTP per email at a time
        match: /.+\@.+\..+/
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires after 5 minutes (300 seconds)
    }
});

const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;