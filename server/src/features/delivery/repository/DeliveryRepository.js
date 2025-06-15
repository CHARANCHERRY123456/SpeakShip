import DeliveryRequest from '../schema/DeliveryRequest.js';

const DeliveryRepository = {
  async create(data) {
    return DeliveryRequest.create(data);
  },

  async findPending({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      DeliveryRequest.find({ status: 'Pending' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer'),
      DeliveryRequest.countDocuments({ status: 'Pending' })
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

  async findByDriver(driverId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      DeliveryRequest.find({ driver: driverId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer'),
      DeliveryRequest.countDocuments({ driver: driverId })
    ]);
    return { results, total };
  },

  async findByCustomer(customerId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      DeliveryRequest.find({ customer: customerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('driver'),
      DeliveryRequest.countDocuments({ customer: customerId })
    ]);
    return { results, total };
  }
};

export default DeliveryRepository;
