// src/features/auth/utils/index.jsx
// Utility functions related to authentication (e.g., token helpers, validators).

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
  // Escape special characters in regex string by doubling backslashes or using character class
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) return 'Password must contain at least one special character (e.g., !@#$%^&*).';
  return '';
}

export function validateAddress(address, isLogin) {
  // This validator is here if you decide to use address for something other than initial signup
  // For initial signup, your backend schemas don't require address
  if (!isLogin && !address) return 'Address is required.'; // Keep this if you plan to re-introduce address to signup later
  return '';
}

// NEW VALIDATORS:
export function validateUsername(username) {
  if (!username) return 'Username is required.';
  if (username.length < 3) return 'Username must be at least 3 characters long.';
  // Add more specific username rules if needed (e.g., no spaces, special chars)
  return '';
}

export function validateName(name) {
  if (!name) return 'Name is required.';
  if (name.length < 2) return 'Name must be at least 2 characters long.';
  return '';
}

export function validatePhone(phone) {
  if (!phone) return 'Phone number is required.';
  // Basic validation: must be digits and a reasonable length (e.g., 7-15 digits)
  // Adjust regex based on expected phone number format (e.g., with country code)
  const phoneRegex = /^\d{7,15}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number (7-15 digits, digits only).';
  return '';
}