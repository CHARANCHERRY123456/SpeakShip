import DeliveryRequest from '../schema/DeliveryRequest.js';
import { buildDeliveryFilters } from '../utils/deliveryFilters.js';
import Driver from '../../auth/schema/Driver.js';

const DeliveryRepository = {
  async create(data) {
    return DeliveryRequest.create(data);
  },

  async findPending({ page = 1, limit = 10, search = '', status = '' } = {}) {
    const skip = (page - 1) * limit;
    const filter = buildDeliveryFilters({ search, status }); // No default to 'Pending', allow all statuses if not set
    const [results, total] = await Promise.all([
      DeliveryRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer'),
      DeliveryRequest.countDocuments(filter)
    ]);
    return { results, total };
  },

  async findById(id) {
    return DeliveryRequest.findById(id).populate('customer').populate('driver');
  },

  async acceptRequest(id, driverId) {
    // Only accept if still pending
    return DeliveryRequest.findOneAndUpdate(
      { _id: id, status: 'Pending' },
      { status: 'Accepted', driver: driverId, updatedAt: Date.now() },
      { new: true }
    );
  },

  async updateStatus(id, newStatus) {
    return DeliveryRequest.findByIdAndUpdate(
      id,
      { status: newStatus, updatedAt: Date.now() },
      { new: true }
    );
  },

  async findByDriver(driverId, { page = 1, limit = 10, search = '', status = '' } = {}) {
    const skip = (page - 1) * limit;
    const filter = { driver: driverId, ...buildDeliveryFilters({ search, status }) };
    const [results, total] = await Promise.all([
      DeliveryRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer'),
      DeliveryRequest.countDocuments(filter)
    ]);
    return { results, total };
  },

  async findByCustomer(customerId, { page = 1, limit = 10, search = '', status = '' } = {}) {
    const skip = (page - 1) * limit;
    const filter = { customer: customerId, ...buildDeliveryFilters({ search, status }) };
    const [results, total] = await Promise.all([
      DeliveryRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('driver'),
      DeliveryRequest.countDocuments(filter)
    ]);
    return { results, total };
  },

  async setDeliveryOtp(id, otp) {
    return DeliveryRequest.findByIdAndUpdate(
      id,
      { deliveryOtp: otp },
      { new: true }
    );
  },

  async markDeliveredAndClearOtp(id) {
    return DeliveryRequest.findByIdAndUpdate(
      id,
      { status: 'Delivered', deliveryOtp: null, updatedAt: Date.now() },
      { new: true }
    );
  },

  async findDriverById(driverId) {
    return Driver.findById(driverId);
  }
};

export default DeliveryRepository;
