// client/src/features/auth/api/index.jsx

import axios from '../../../api/axios'; // Ensure your axios instance path is correct

// Function for Customer Login
export async function loginCustomer(username, password) {
  const response = await axios.post('/api/auth/login/customer', { username, password });
  return response.data;
}

// Function for Driver Login
export async function loginDriver(username, password) {
  const response = await axios.post('/api/auth/login/driver', { username, password });
  return response.data;
}

// Function for Admin Login
export async function loginAdmin(username, password) {
  const response = await axios.post('/api/auth/login/admin', { username, password });
  return response.data;
}

// Function for Customer Registration (Backend will NOT send OTP here anymore)
export async function registerCustomer(username, name, email, password, phone) {
  const response = await axios.post('/api/auth/signup/customer', { username, name, email, password, phone, isVerified: true }); // Pass isVerified:true
  return response.data;
}

// Function for Driver Registration (Backend will NOT send OTP here anymore)
export async function registerDriver(username, name, email, password, phone) {
  const response = await axios.post('/api/auth/signup/driver', { username, name, email, password, phone, isVerified: true }); // Pass isVerified:true
  return response.data;
}

// --- NEW API CALL: Send OTP for initial email verification ---
export async function sendEmailOtpBackend(email, role) {
    const response = await axios.post('/api/auth/send-otp', { email, role });
    return response.data; // Should return { message: 'OTP sent to your email.' }
}

// Function to verify email OTP (existing, but ensure it's correct)
export async function verifyEmailOtp(email, otp, role) {
  const response = await axios.post('/api/auth/verify-otp', { email, otp, role });
  return response.data;
}

// Function to resend email OTP (existing, but ensure it's correct)
export async function resendEmailOtp(email, role) {
  const response = await axios.post('/api/auth/send-otp', { email, role });
  return response.data;
}

// Function to handle Google login callback (existing)
export async function googleLoginCallback(code, role) { // Role might be null if not explicitly selected
  const response = await axios.get(`/api/auth/google/callback?code=${code}${role ? `&role=${role}` : ''}`);
  return response.data;
}

// Function to fetch user details (existing)
export async function getMe() {
  const response = await axios.get('/api/auth/me');
  return response.data;
}