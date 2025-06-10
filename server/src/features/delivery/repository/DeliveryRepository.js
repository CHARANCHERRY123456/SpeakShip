import DeliveryRequest from '../schema/DeliveryRequest.js';

const DeliveryRepository = {
  async create(data) {
    return DeliveryRequest.create(data);
  },

  async findPending() {
    return DeliveryRequest.find({ status: 'Pending' }).sort({ createdAt: -1 }).populate('customer');
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

  async findByDriver(driverId) {
    return DeliveryRequest.find({ driver: driverId }).sort({ createdAt: -1 }).populate('customer');
  },

  async findByCustomer(customerId) {
    return DeliveryRequest.find({ customer: customerId }).sort({ createdAt: -1 }).populate('driver');
  }
};

export default DeliveryRepository;
