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

    // NEW METHOD: Find delivery by ID (for use by controller for authorization)
  async findById(id) {
    return DeliveryRepository.findById(id);
  }


   // NEW METHOD: Update delivery status
  async updateDeliveryStatus(id, newStatus) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      throw new Error('Delivery request not found.');
    }
    // Optional: Add more specific status transition logic here if needed
    // e.g., driver can only change status from 'Accepted' to 'Completed'
    // if (delivery.status !== 'Accepted' && newStatus === 'Completed') {
    //   throw new Error('Delivery can only be marked as completed from Accepted status.');
    // }
    return DeliveryRepository.updateStatus(id, newStatus);
  }

  async listForDriver(driverId) {
    return DeliveryRepository.findByDriver(driverId);
  }

  async listForCustomer(customerId) {
    return DeliveryRepository.findByCustomer(customerId);
  }
}

export default new DeliveryService();
