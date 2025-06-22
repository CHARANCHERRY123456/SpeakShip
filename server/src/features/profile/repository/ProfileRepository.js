// server/src/features/profile/repository/ProfileRepository.js
// Repository for profile data access (MongoDB, Mongoose assumed)
import Customer from '../../auth/schema/Customer.js';
import Driver from '../../auth/schema/Driver.js';
import Admin from '../../auth/schema/Admin.js';

class ProfileRepository {
    // Get user profile by ID (search all user types)
    async getById(userId) {
        let user = await Customer.findById(userId).select('-password -__v -resetToken -resetTokenExpiry');
        if (!user) user = await Driver.findById(userId).select('-password -__v -resetToken -resetTokenExpiry');
        if (!user) user = await Admin.findById(userId).select('-password -__v -resetToken -resetTokenExpiry');
        return user;
    }

    // Update user profile by ID (search all user types)
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
