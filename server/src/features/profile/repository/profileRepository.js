import Admin from '../../auth/schema/Admin.js';
import Customer from '../../auth/schema/Customer.js';
import Driver from '../../auth/schema/Driver.js';
import { PROFILE_IMAGE_FIELD } from '../constants/profileConstants.js';

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

class ProfileRepository {
  async getById(userId) {
    let user = await Customer.findById(userId).select('-password -__v -resetToken -resetTokenExpiry');
    if (!user) user = await Driver.findById(userId).select('-password -__v -resetToken -resetTokenExpiry');
    if (!user) user = await Admin.findById(userId).select('-password -__v -resetToken -resetTokenExpiry');
    return user;
  }

  async updateById(userId, updateData) {
    const allowedFields = ['name', 'email', 'phone', 'avatar', 'image'];
    const filteredData = {};
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) filteredData[key] = updateData[key];
    }
    let user = await Customer.findByIdAndUpdate(userId, filteredData, { new: true, runValidators: true })
      .select('-password -__v -resetToken -resetTokenExpiry');
    if (!user) user = await Driver.findByIdAndUpdate(userId, filteredData, { new: true, runValidators: true })
      .select('-password -__v -resetToken -resetTokenExpiry');
    if (!user) user = await Admin.findByIdAndUpdate(userId, filteredData, { new: true, runValidators: true })
      .select('-password -__v -resetToken -resetTokenExpiry');
    return user;
  }
}

export default new ProfileRepository();
