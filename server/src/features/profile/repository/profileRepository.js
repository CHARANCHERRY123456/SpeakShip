// Import all user schemas
import Admin from '../../auth/schema/Admin.js';
import Customer from '../../auth/schema/Customer.js';
import Driver from '../../auth/schema/Driver.js';
import { PROFILE_IMAGE_FIELD } from '../constants/profileConstants.js';

// Helper to get the correct model by user type
const getModelByType = (userType) => {
  switch (userType) {
    case 'admin':
      return Admin;
    case 'customer':
      return Customer;
    case 'driver':
      return Driver;
    default:
      throw new Error('Invalid user type');
  }
};

export const getUserById = async (userId, userType) => {
  const Model = getModelByType(userType);
  return Model.findById(userId);
};

export const updateUserProfileImage = async (userId, userType, imageUrl) => {
  const Model = getModelByType(userType);
  return Model.findByIdAndUpdate(userId, { [PROFILE_IMAGE_FIELD]: imageUrl }, { new: true });
};

export const removeUserProfileImage = async (userId, userType, defaultUrl) => {
  const Model = getModelByType(userType);
  return Model.findByIdAndUpdate(userId, { [PROFILE_IMAGE_FIELD]: defaultUrl }, { new: true });
};
