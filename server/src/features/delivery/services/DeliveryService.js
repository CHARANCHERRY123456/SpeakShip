import DeliveryRepository from '../repository/DeliveryRepository.js';
import sendMail from '../../../utils/mailer.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateOtp(length = 6) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

class DeliveryService {
  async createRequest(data, customerId, file) {
    let photoUrl = data.photoUrl;
    const defaultPhotoUrl = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';

    if (file) {
      photoUrl = file.path;
    } else {
      photoUrl = defaultPhotoUrl;
    }

    const deliveryData = {
      ...data,
      customer: customerId,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl,
    };

    const delivery = await DeliveryRepository.create(deliveryData);

    try {
      const templatePath = path.join(__dirname, '../templates/orderCreated.html');
      let html = await fs.readFile(templatePath, 'utf-8');
      html = html.replace(/{{name}}/g, delivery.name || 'Customer');
      html = html.replace(/{{packageName}}/g, delivery.packageName);
      html = html.replace(/{{pickupAddress}}/g, delivery.pickupAddress);
      html = html.replace(/{{dropoffAddress}}/g, delivery.dropoffAddress);
      await sendMail({
        to: delivery.email,
        subject: 'Your SpeakShip order has been placed',
        html
      });
    } catch (err) {
      console.error('Failed to send order creation email:', err);
    }
    return delivery;
  }

  async acceptRequest(id, driverId) {
    const delivery = await DeliveryRepository.acceptRequest(id, driverId);
    if (!delivery) return null;

    const driver = await DeliveryRepository.findDriverById(driverId);

    try {
      const templatePath = path.join(__dirname, '../templates/orderAccepted.html');
      let html = await fs.readFile(templatePath, 'utf-8');
      html = html.replace(/{{name}}/g, delivery.name || 'Customer');
      html = html.replace(/{{packageName}}/g, delivery.packageName);
      html = html.replace(/{{pickupAddress}}/g, delivery.pickupAddress);
      html = html.replace(/{{dropoffAddress}}/g, delivery.dropoffAddress);
      html = html.replace(/{{driverName}}/g, driver?.name || 'Driver');
      html = html.replace(/{{driverPhone}}/g, driver?.phone || '');
      await sendMail({
        to: delivery.email,
        subject: 'Your SpeakShip order has been accepted',
        html
      });
    } catch (err) {
      console.error('Failed to send order accepted email:', err);
    }
    return delivery;
  }

  async updateDeliveryStatus(id, newStatus) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      throw new Error('Delivery request not found.');
    }

    if (newStatus === 'Delivered') {
      if (delivery.status !== 'In-Transit') {
        throw new Error('Delivery must be "In-Transit" to initiate the delivery OTP process.');
      }

      const otp = generateOtp();
      const updatedDeliveryWithOtp = await DeliveryRepository.setDeliveryOtp(id, otp);

      // Send OTP email to customer
      try {
        const templatePath = path.join(__dirname, '../templates/orderOtp.html');
        let html = await fs.readFile(templatePath, 'utf-8');
        html = html.replace(/{{name}}/g, updatedDeliveryWithOtp.name || 'Customer');
        html = html.replace(/{{packageName}}/g, updatedDeliveryWithOtp.packageName);
        html = html.replace(/{{otp}}/g, otp);
        await sendMail({
          to: updatedDeliveryWithOtp.email,
          subject: 'Your SpeakShip delivery OTP',
          html
        });
      } catch (err) {
        console.error('Failed to send OTP email:', err);
      }
      return updatedDeliveryWithOtp;
    } else if (newStatus === 'Cancelled') {
      if (['Delivered'].includes(delivery.status)) {
        throw new Error(`Cannot cancel a delivery that is '${delivery.status}'.`);
      }

      const updatedDelivery = await DeliveryRepository.updateStatus(id, newStatus);

      try {
        const templatePath = path.join(__dirname, '../templates/orderCancelled.html');
        let html = await fs.readFile(templatePath, 'utf-8');
        html = html.replace(/{{name}}/g, delivery.name || 'Customer');
        html = html.replace(/{{packageName}}/g, delivery.packageName);
        await sendMail({
          to: delivery.email,
          subject: 'Your SpeakShip order was cancelled',
          html
        });
      } catch (err) {
        console.error('Failed to send cancellation email to customer:', err);
      }

      if (delivery.driver) {
        try {
          const driver = await DeliveryRepository.findDriverById(delivery.driver);
          if (driver) {
            const templatePath = path.join(__dirname, '../templates/orderCancelledDriver.html');
            let html = await fs.readFile(templatePath, 'utf-8');
            html = html.replace(/{{driverName}}/g, driver?.name || 'Driver');
            html = html.replace(/{{packageName}}/g, delivery.packageName);
            await sendMail({
              to: driver.email,
              subject: 'A SpeakShip delivery was cancelled',
              html
            });
          }
        } catch (err) {
          console.error('Failed to send cancellation email to driver:', err);
        }
      }
      return updatedDelivery;
    }

    return DeliveryRepository.updateStatus(id, newStatus);
  }

  async verifyDeliveryOtp(id, otp) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      throw new Error('Delivery request not found.');
    }

    if (delivery.status !== 'In-Transit') {
      throw new Error('Cannot verify OTP: Delivery is not in "In-Transit" status.');
    }

    if (delivery.deliveryOtp !== otp) {
      throw new Error('Invalid OTP.');
    }

    const finalDelivery = await DeliveryRepository.markDeliveredAndClearOtp(id);

    // Send "Order Delivered" email to the customer
    try {
      // Assuming you have an 'orderDelivered.html' template
      const templatePath = path.join(__dirname, '../templates/orderDelivered.html');
      let html = await fs.readFile(templatePath, 'utf-8');
      html = html.replace(/{{name}}/g, finalDelivery.name || 'Customer');
      html = html.replace(/{{packageName}}/g, finalDelivery.packageName);
      html = html.replace(/{{dropoffAddress}}/g, finalDelivery.dropoffAddress); // Or other relevant delivery details
      await sendMail({
        to: finalDelivery.email,
        subject: 'Your SpeakShip order has been delivered!',
        html
      });
    } catch (err) {
      console.error('Failed to send order delivered email:', err);
    }

    return finalDelivery;
  }

  async findById(id) {
    return DeliveryRepository.findById(id);
  }

  async listPending({ page = 1, limit = 10, search = '', status = '' } = {}) {
    return DeliveryRepository.findPending({ page, limit, search, status });
  }

  async listForDriver(driverId, { page = 1, limit = 10, search = '', status = '' } = {}) {
    return DeliveryRepository.findByDriver(driverId, { page, limit, search, status });
  }

  async listForCustomer(customerId, { page = 1, limit = 10, search = '', status = '' } = {}) {
    return DeliveryRepository.findByCustomer(customerId, { page, limit, search, status });
  }
}

export default new DeliveryService();