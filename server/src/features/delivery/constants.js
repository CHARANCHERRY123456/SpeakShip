// Delivery feature constants

// Status options for deliveries
export const DELIVERY_STATUS = Object.freeze([
  'Pending',
  'Accepted',
  'In-Transit',
  'Delivered',
  'Cancelled'
]);

// Priority levels
export const PRIORITY_LEVELS = Object.freeze([
  'Normal',
  'Urgent',
  'Overnight'
]);

// Default error messages (feature-specific)
export const DELIVERY_ERRORS = Object.freeze({
  NOT_FOUND: 'Delivery request not found.',
  NOT_AUTHORIZED: 'Not authorized to perform this action.',
  ALREADY_ACCEPTED: 'Request already accepted or not found.',
  INVALID_STATUS: 'Invalid delivery status.'
});

// Global constants (can be imported elsewhere if needed)
export const GLOBAL_ROLES = Object.freeze([
  'customer',
  'driver',
  'admin'
]);

export const GLOBAL_ERRORS = Object.freeze({
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  SERVER_ERROR: 'Internal Server Error. Please check server logs for details.'
});
