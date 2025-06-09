import axios from '../../../api/axios';

// API calls related to authentication (login, register, logout, etc.)

// Function for Customer Login
export async function loginCustomer(usernameOrEmail, password) { // Accepts username or email
    const response = await axios.post('/api/auth/login/customer', { username: usernameOrEmail, password });
    return response.data; // Should return { message, customer, token }
}

// Function for Driver Login
export async function loginDriver(usernameOrEmail, password) { // Accepts username or email
    const response = await axios.post('/api/auth/login/driver', { username: usernameOrEmail, password });
    return response.data; // Should return { message, driver, token }
}

// Function for Admin Login
export async function loginAdmin(usernameOrEmail, password) { // Accepts username or email
    const response = await axios.post('/api/auth/login/admin', { username: usernameOrEmail, password });
    return response.data; // Should return { message, admin, token }
}

// Function for Customer Registration
export async function registerCustomer(username, name, email, password, phone) {
    // Ensure all required fields by CustomerSchema are sent
    const response = await axios.post('/api/auth/signup/customer', { username, name, email, password, phone });
    return response.data; // Should return { message, customer }
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