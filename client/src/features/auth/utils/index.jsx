// Utility functions related to authentication (e.g., token helpers, validators).
// Add helper functions for authentication logic here.

export function validateEmail(email) {
  if (!email) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  if (!/[\\\[\]{}|;:'\",.<>\/?~!@#$%^&*()_+\-=]/.test(password)) return 'Password must contain at least one special character (e.g., !@#$%^&*).';
  return '';
}

export function validateAddress(address, isLogin) {
  if (!isLogin && !address) return 'Address is required.';
  return '';
}
