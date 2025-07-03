import ProfileRepository, { getUserById, updateUserProfileImage, removeUserProfileImage } from '../repository/profileRepository.js';

const ProfileController = {
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await ProfileRepository.getById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Failed to fetch profile' });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      const updatedUser = await ProfileRepository.updateById(userId, updateData);
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Failed to update profile' });
    }
  }
};

export default ProfileController;
