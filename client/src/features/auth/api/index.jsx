import axios from '../../../api/axios';

// API calls related to authentication (login, register, logout, etc.)

// Function for User Login
export async function loginUser(username, password) { // Expects username, not email
    const response = await axios.post('/api/auth/login/user', { username, password });
    return response.data; // Should return { message, user, token }
}

// Function for Driver Login
export async function loginDriver(username, password) { // Expects username, not email
    const response = await axios.post('/api/auth/login/driver', { username, password });
    return response.data; // Should return { message, driver, token }
}

// Function for User Registration
export async function registerUser(username, name, email, password, phone) {
    // Ensure all required fields by UserSchema are sent
    const response = await axios.post('/api/auth/signup/user', { username, name, email, password, phone });
    return response.data; // Should return { message, user }
}

// Function for Driver Registration
export async function registerDriver(username, name, email, password, phone) {
    // Ensure all required fields by DriverSchema are sent
    const response = await axios.post('/api/auth/signup/driver', { username, name, email, password, phone });
    return response.data; // Should return { message, driver }
}

// Logout (client-side deletion of token is usually enough for JWT,
// but if you have backend logout logic, you'd call it here)
// export async function logoutApi() {
//   // Example: if backend needed a ping for logging purposes
//   const response = await axios.post('/api/auth/logout');
//   return response.data;
// }

// Google SignIn - this part is fine conceptually, but requires backend implementation
// before it will work end-to-end. We'll focus on username/password for now.
export function googleSignIn() {
    window.location.href = `${axios.defaults.baseURL}/api/auth/google`;
}