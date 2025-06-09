import DeliveryRepository from '../repository/DeliveryRepository.js';

class DeliveryService {
  async createRequest(data, customerId, file) {
    const deliveryData = {
      ...data,
      customer: customerId,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    if (file) {
      deliveryData.photoUrl = `/uploads/${file.filename}`;
    }
    return DeliveryRepository.create(deliveryData);
  }

  async listPending() {
    return DeliveryRepository.findPending();
  }

  async acceptRequest(id, driverId) {
    return DeliveryRepository.acceptRequest(id, driverId);
  }

  async listForDriver(driverId) {
    return DeliveryRepository.findByDriver(driverId);
  }

  async listForCustomer(customerId) {
    return DeliveryRepository.findByCustomer(customerId);
  }
}

export default new DeliveryService();
