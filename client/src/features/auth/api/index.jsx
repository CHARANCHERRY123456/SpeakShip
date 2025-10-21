import axios from '../../../api/axios';
export async function loginCustomer(username, password) {
  const response = await axios.post('/api/auth/login/customer', { username, password });
  return response.data;
}

export async function loginDriver(username, password) {
  const response = await axios.post('/api/auth/login/driver', { username, password });
  return response.data;
}

export async function loginAdmin(username, password) {
  const response = await axios.post('/api/auth/login/admin', { username, password });
  return response.data;
}

export async function registerCustomer(username, name, email, password, phone) {
  const response = await axios.post('/api/auth/signup/customer', { username, name, email, password, phone, isVerified: true });
  return response.data;
}

export async function registerDriver(username, name, email, password, phone) {
  const response = await axios.post('/api/auth/signup/driver', { username, name, email, password, phone, isVerified: true });
  return response.data;
}

export async function sendEmailOtpBackend(email, role) {
    const response = await axios.post('/api/auth/send-otp', { email, role });
    return response.data;
}

export async function verifyEmailOtp(email, otp, role) {
  const response = await axios.post('/api/auth/verify-otp', { email, otp, role });
  return response.data;
}

export async function resendEmailOtp(email, role) {
  const response = await axios.post('/api/auth/send-otp', { email, role });
  return response.data;
}

export async function getMe() {
  const response = await axios.get('/api/auth/me');
  return response.data;
}