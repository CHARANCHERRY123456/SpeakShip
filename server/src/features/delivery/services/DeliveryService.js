import DeliveryRepository from '../repository/DeliveryRepository.js';
import sendMail from '../../../utils/mailer.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
import CoinsService from '../../coins/services/CoinsService.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateOtp(length = 6) {
  // Generates a random N-digit number as a string
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
}

class DeliveryService {
  /**
   * Creates a new delivery request, handles file upload to Cloudinary,
   * and sends an order creation email to the customer.
   * @param {object} data - Delivery request data.
   * @param {string} customerId - ID of the customer creating the request.
   * @param {object} [file] - Optional file buffer for package photo.
   * @returns {Promise<object>} The created delivery object.
   */
  async createRequest(data, customerId, file) {
    let photoUrl = data.photoUrl; // Frontend might already provide a URL (e.g., from a previous upload or default)
    const defaultPhotoUrl = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';

    if (file) {
      try {
        // Define a promise-based stream upload function for Cloudinary
        const streamUpload = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
              { folder: 'speakship-deliveries', resource_type: 'image' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            // End the stream with the file buffer to initiate the upload
            stream.end(fileBuffer);
          });
        };
        const result = await streamUpload(file.buffer);
        photoUrl = result.secure_url; // Use the secure URL from Cloudinary
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
        // Fallback to a default image if Cloudinary upload fails
        photoUrl = defaultPhotoUrl;
      }
    } else {
      // If no file is provided, use the default photo URL
      photoUrl = defaultPhotoUrl;
    }

    const deliveryData = {
      ...data,
      customer: customerId,
      status: 'Pending', // Initial status
      createdAt: new Date(),
      updatedAt: new Date(),
      photoUrl,
    };

    const delivery = await DeliveryRepository.create(deliveryData);
    await CoinsService.addCoins(customerId, 1); // 💰 Add 1 coin

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

  /**
   * Accepts a pending delivery request by a driver.
   * Updates delivery status to 'Accepted' and assigns the driver.
   * Sends an email to the customer informing them of the acceptance.
   * @param {string} id - ID of the delivery request.
   * @param {string} driverId - ID of the driver accepting the request.
   * @returns {Promise<object|null>} The updated delivery object or null if not found.
   */
  async acceptRequest(id, driverId) {
    // This repository method should handle changing status to 'Accepted' and assigning driver
    const delivery = await DeliveryRepository.acceptRequest(id, driverId);
    
    if (!delivery) return null;
    await CoinsService.addCoins(delivery.customer, 1); // 💰 Add 1 coin to customer

    // Fetch driver details for the email
    const driver = await DeliveryRepository.findDriverById(driverId);
    

    try {
      const templatePath = path.join(__dirname, '../templates/orderAccepted.html');
      let html = await fs.readFile(templatePath, 'utf-8');
      html = html.replace(/{{name}}/g, delivery.name || 'Customer');
      html = html.replace(/{{packageName}}/g, delivery.packageName);
      html = html.replace(/{{pickupAddress}}/g, delivery.pickupAddress);
      html = html.replace(/{{dropoffAddress}}/g, delivery.dropoffAddress);
      html = html.replace(/{{driverName}}/g, driver?.name || 'Driver');
      html = html.replace(/{{driverPhone}}/g, driver?.phone || ''); // Use optional chaining for safety
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

  /**
   * Updates the status of a delivery.
   * Special handling for 'Delivered' (initiates OTP process) and 'Cancelled' (sends notifications).
   * For other statuses, it performs a direct status update.
   * @param {string} id - ID of the delivery request.
   * @param {string} newStatus - The new status to set ('In-Transit', 'Delivered', 'Cancelled', etc.).
   * @returns {Promise<object>} The updated delivery object.
   * @throws {Error} If the delivery is not found or status transition is invalid.
   */
  async updateDeliveryStatus(id, newStatus) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      throw new Error('Delivery request not found.');
    }

    if (newStatus === 'Delivered') {
      // This section is for INITIATING the delivery completion process (sending OTP).
      // The actual status change to 'Delivered' happens ONLY after successful OTP verification.
      if (delivery.status !== 'In-Transit') {
        // Corrected error message for initiating OTP process
        throw new Error('Delivery must be "In-Transit" to initiate the delivery OTP process.');
      }

      // Generate and store OTP in the database (status remains 'In-Transit' at this point)
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
      // Return the delivery object with the OTP set (status is still 'In-Transit')
      return updatedDeliveryWithOtp; // Return the delivery object with OTP
    } else if (newStatus === 'Cancelled') {
      // Handle cancellation logic and send emails
      // Ensure the status can be cancelled (e.g., not already delivered)
      if (['Delivered'].includes(delivery.status)) {
        throw new Error(`Cannot cancel a delivery that is '${delivery.status}'.`);
      }

      // Update status to Cancelled first
      const updatedDelivery = await DeliveryRepository.updateStatus(id, newStatus);
      // 💰 Decrement 1 coin on cancellation
      await CoinsService.removeCoins(updatedDelivery.customer, 1);

      // Notify Customer
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

      // Notify Driver (if assigned)
      if (delivery.driver) {
        try {
          const driver = await DeliveryRepository.findDriverById(delivery.driver);
          if (driver) { // Ensure driver exists before trying to send email
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

      // For all other regular status updates
      const updatedDelivery = await DeliveryRepository.updateStatus(id, newStatus);

        // If status is now exactly 'Delivered' (after OTP verification step)
        if (newStatus === 'Delivered') {
          // 💰 Add 10 coins after delivery is fully marked as Delivered
          await CoinsService.addCoins(updatedDelivery.customer, 10);
        }

        return updatedDelivery;
  }

  /**
   * Verifies the OTP provided for a delivery and marks it as 'Delivered'.
   * @param {string} id - ID of the delivery request.
   * @param {string} otp - The OTP to verify.
   * @returns {Promise<object>} The updated delivery object with status 'Delivered'.
   * @throws {Error} If delivery not found, not in 'In-Transit' status, or OTP is invalid.
   */
  async verifyDeliveryOtp(id, otp) {
    const delivery = await DeliveryRepository.findById(id);
    if (!delivery) {
      throw new Error('Delivery request not found.');
    }

    // Crucial validation: Ensure the delivery is currently In-Transit
    if (delivery.status !== 'In-Transit') {
      throw new Error('Cannot verify OTP: Delivery is not in "In-Transit" status.');
    }

    // Verify the provided OTP against the stored OTP
    if (delivery.deliveryOtp !== otp) {
      throw new Error('Invalid OTP.');
    }

    // If OTP is valid, mark as delivered and clear the OTP
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

    // Return the final delivered delivery object
    return finalDelivery;
  }

  /**
   * Finds a delivery request by its ID.
   * @param {string} id - The ID of the delivery request.
   * @returns {Promise<object|null>} The delivery object or null if not found.
   */
  async findById(id) {
    return DeliveryRepository.findById(id);
  }

  /**
   * Lists pending delivery requests with pagination and search.
   * @param {object} options - Pagination and search options.
   * @param {number} options.page - Current page number.
   * @param {number} options.limit - Number of items per page.
   * @param {string} options.search - Search query.
   * @param {string} options.status - Filter by status.
   * @returns {Promise<object>} An object containing delivery requests and total count.
   */
  async listPending({ page = 1, limit = 10, search = '', status = '' } = {}) {
    return DeliveryRepository.findPending({ page, limit, search, status });
  }

  /**
   * Lists delivery requests assigned to a specific driver with pagination and search.
   * @param {string} driverId - The ID of the driver.
   * @param {object} options - Pagination and search options.
   * @returns {Promise<object>} An object containing delivery requests and total count.
   */
  async listForDriver(driverId, { page = 1, limit = 10, search = '', status = '' } = {}) {
    return DeliveryRepository.findByDriver(driverId, { page, limit, search, status });
  }

  /**
   * Lists delivery requests made by a specific customer with pagination and search.
   * @param {string} customerId - The ID of the customer.
   * @param {object} options - Pagination and search options.
   * @returns {Promise<object>} An object containing delivery requests and total count.
   */
  async listForCustomer(customerId, { page = 1, limit = 10, search = '', status = '' } = {}) {
    return DeliveryRepository.findByCustomer(customerId, { page, limit, search, status });
  }
}

export default new DeliveryService();