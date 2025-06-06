import axios from '../../../api/axios';

// API calls related to authentication (login, register, logout, etc.)
// Add functions to interact with authentication endpoints here.

export async function login({ email, password, role }) {
  const response = await axios.post('/api/auth/login', { email, password, role });
  return response.data;
}

export async function register({ email, password, role, address }) {
  const response = await axios.post('/api/auth/register', { email, password, role, address });
  return response.data;
}

export function googleSignIn() {
  window.location.href = `${axios.defaults.baseURL}/api/auth/google`;
}
