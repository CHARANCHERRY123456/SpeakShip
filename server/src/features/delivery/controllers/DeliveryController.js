import DeliveryService from '../services/DeliveryService.js';
import { DELIVERY_STATUS } from '../constants.js';

const DeliveryController = {
  async createRequest(req, res) {
    try {
      const customerId = req.user.id;
      const delivery = await DeliveryService.createRequest(req.body, customerId, req.file);
      res.status(201).json(delivery);
    } catch (err) {
      console.error("Backend Error in DeliveryController.createRequest:", err);
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({
          error: `Validation failed: ${errors.join(', ')}`
        });
      }
      res.status(500).json({ error: 'Internal Server Error. Please check server logs for details.' });
    }
  },

  async listPending(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || '';
      const status = req.query.status || '';
      const data = await DeliveryService.listPending({ page, limit, search, status });
      res.json(data);
    } catch (err) {
      console.error("Backend Error in DeliveryController.listPending:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async acceptRequest(req, res) {
    try {
      const driverId = req.user.id;
      const { id } = req.params;
      const delivery = await DeliveryService.acceptRequest(id, driverId);
      if (!delivery) return res.status(400).json({ error: 'Request already accepted or not found.' });
      res.json(delivery);
    } catch (err) {
      console.error("Backend Error in DeliveryController.acceptRequest:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const delivery = await DeliveryService.findById(id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery request not found.' });
      }
      // Allow drivers to update status for their assigned deliveries
      if (userRole === 'driver') {
        if (!delivery.driver || delivery.driver._id.toString() !== userId.toString()) {
          return res.status(403).json({ error: 'Not authorized to update this delivery.' });
        }
        const updatedDelivery = await DeliveryService.updateDeliveryStatus(id, newStatus);
        return res.json(updatedDelivery);
      }
      // Allow customers to cancel their own deliveries if Pending or Accepted
      if (userRole === 'customer') {
        // delivery.customer may be a populated object, so compare _id
        const deliveryCustomerId = delivery.customer?._id?.toString?.() || delivery.customer?.toString?.() || delivery.customer;
        if (newStatus !== DELIVERY_STATUS[4]) { // 'Cancelled'
          return res.status(403).json({ error: 'Customers can only cancel deliveries.' });
        }
        if (deliveryCustomerId !== userId.toString()) {
          return res.status(403).json({ error: 'Not authorized to cancel this delivery.' });
        }
        if (![DELIVERY_STATUS[0], DELIVERY_STATUS[1]].includes(delivery.status)) { // 'Pending', 'Accepted'
          return res.status(403).json({ error: 'Cannot cancel after delivery is in progress.' });
        }
        const updatedDelivery = await DeliveryService.updateDeliveryStatus(id, newStatus);
        return res.json(updatedDelivery);
      }
      // All other roles forbidden
      return res.status(403).json({ error: 'Not authorized.' });
    } catch (err) {
      console.error("Backend Error in DeliveryController.updateStatus:", err);
      res.status(400).json({ error: err.message || 'Bad Request: Unknown error during status update.' });
    }
  },

  async listForDriver(req, res) {
    try {
      const driverId = req.user.id;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || '';
      const status = req.query.status || '';
      const data = await DeliveryService.listForDriver(driverId, { page, limit, search, status });
      res.json(data);
    } catch (err) {
      console.error("Backend Error in DeliveryController.listForDriver:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async listForCustomer(req, res) {
    try {
      const customerId = req.user.id;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || '';
      const status = req.query.status || '';
      const data = await DeliveryService.listForCustomer(customerId, { page, limit, search, status });
      res.json(data);
    } catch (err) {
      console.error("Backend Error in DeliveryController.listForCustomer:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async verifyDeliveryOtp(req, res) {
    try {
      const { id } = req.params;
      const { otp } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;
      const delivery = await DeliveryService.findById(id);
      if (!delivery) return res.status(404).json({ error: 'Delivery request not found.' });
      if (userRole === 'customer') {
        // Only allow if this customer owns the delivery
        const deliveryCustomerId = delivery.customer?._id?.toString?.() || delivery.customer?.toString?.() || delivery.customer;
        if (deliveryCustomerId !== userId.toString()) {
          return res.status(403).json({ error: 'Not authorized to verify OTP for this delivery.' });
        }
      } else if (userRole === 'driver') {
        // Only allow if this driver is assigned to the delivery
        const deliveryDriverId = delivery.driver?._id?.toString?.() || delivery.driver?.toString?.() || delivery.driver;
        if (deliveryDriverId !== userId.toString()) {
          return res.status(403).json({ error: 'Not authorized to verify OTP for this delivery.' });
        }
      } else {
        return res.status(403).json({ error: 'Not authorized.' });
      }
      // If authorized, verify OTP
      const updatedDelivery = await DeliveryService.verifyDeliveryOtp(id, otp);
      res.json(updatedDelivery);
    } catch (err) {
      res.status(400).json({ error: err.message || 'OTP verification failed.' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const delivery = await DeliveryService.findById(id);
      if (!delivery) return res.status(404).json({ error: 'Delivery not found.' });
      res.json(delivery);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default DeliveryController;
