import mongoose from 'mongoose';

// Shared filtering utility for DeliveryRequest queries
// Supports search (by name, packageName, pickup/dropoff address, email, phone, _id) and status

export function buildDeliveryFilters({ search = '', status = '' } = {}) {
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    const orFilters = [
      { name: searchRegex },
      { packageName: searchRegex },
      { pickupAddress: searchRegex },
      { dropoffAddress: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ];
    if (mongoose.isValidObjectId(search)) {
      orFilters.push({ _id: search });
    }
    filter.$or = orFilters;
  }

  return filter;
}
