import DeliveryRepository from '../repository/DeliveryRepository.js';
import sendMail from '../../../utils/mailer.js';
import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateOtp(length = 6) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

class DeliveryService {
  async createRequest(data, customerId, file) {
    let photoUrl = data.photoUrl;
    if (file) {
      // Upload to Cloudinary
      try {
        const uploadResult = await cloudinary.v2.uploader.upload_stream({
          folder: 'speakship-deliveries',
          resource_type: 'image',
        }, (error, result) => {
          if (error) throw error;
          return result;
        });
        // Use a Promise to handle stream
        const streamUpload = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
              { folder: 'speakship-deliveries', resource_type: 'image' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            stream.end(fileBuffer);
          });
        };
        const result = await streamUpload(file.buffer);
        photoUrl = result.secure_url;
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
        photoUrl = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';
      }
    } else {
      // No file, use default
      photoUrl = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';
    }
    const deliveryData = {
      ...data,
      customer: customerId,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl,
    };
    // photoUrl is now always provided by frontend (Cloudinary or default)
    const delivery = await DeliveryRepository.create(deliveryData);
    // Send order creation email to customer
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
    // Fetch driver via repository
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
        throw new Error('Can only mark as Delivered from In-Transit status.');
      }
      // Generate OTP, update via repository, send email
      const otp = generateOtp();
      await DeliveryRepository.setDeliveryOtp(id, otp);
      try {
        const templatePath = path.join(__dirname, '../templates/orderOtp.html');
        let html = await fs.readFile(templatePath, 'utf-8');
        html = html.replace(/{{name}}/g, delivery.name || 'Customer');
        html = html.replace(/{{packageName}}/g, delivery.packageName);
        html = html.replace(/{{otp}}/g, otp);
        await sendMail({
          to: delivery.email,
          subject: 'Your SpeakShip delivery OTP',
          html
        });
      } catch (err) {
        console.error('Failed to send OTP email:', err);
      }
      // Return delivery with OTP (not status update yet)
      return await DeliveryRepository.findById(id);
    }
    if (newStatus === 'Cancelled') {
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
          const templatePath = path.join(__dirname, '../templates/orderCancelledDriver.html');
          let html = await fs.readFile(templatePath, 'utf-8');
          html = html.replace(/{{driverName}}/g, driver?.name || 'Driver');
          html = html.replace(/{{packageName}}/g, delivery.packageName);
          await sendMail({
            to: driver.email,
            subject: 'A SpeakShip delivery was cancelled',
            html
          });
        } catch (err) {
          console.error('Failed to send cancellation email to driver:', err);
        }
      }
    }
    return DeliveryRepository.updateStatus(id, newStatus);
  }

  async verifyDeliveryOtp(id, otp) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) throw new Error('Delivery request not found.');
    if (delivery.deliveryOtp !== otp) throw new Error('Invalid OTP.');
    // Mark as delivered and clear OTP via repository
    await DeliveryRepository.markDeliveredAndClearOtp(id);
    return DeliveryRepository.findById(id);
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
