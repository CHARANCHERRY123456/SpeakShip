import { DELIVERY_STATUS } from '../constants.js';

export const parseQueryParams = (query) => ({
  page: parseInt(query.page, 10) || 1,
  limit: parseInt(query.limit, 10) || 10,
  search: query.search || '',
  status: query.status || ''
});

export const extractUserId = (obj) => {
  return obj?._id?.toString?.() || obj?.toString?.() || obj;
};

export const isOwner = (resourceId, userId) => {
  return extractUserId(resourceId) === userId.toString();
};

export const canDriverUpdateDelivery = (delivery, driverId) => {
  if (!delivery.driver) return false;
  return isOwner(delivery.driver, driverId);
};

export const canCustomerCancelDelivery = (delivery, customerId) => {
  const isOwner = extractUserId(delivery.customer) === customerId.toString();
  const canCancel = [DELIVERY_STATUS[0], DELIVERY_STATUS[1]].includes(delivery.status);
  return isOwner && canCancel;
};

export const handleValidationError = (err) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return {
      status: 400,
      error: `Validation failed: ${errors.join(', ')}`
    };
  }
  return null;
};
