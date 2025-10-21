import DeliveryService from '../services/DeliveryService.js';
import { DELIVERY_STATUS } from '../constants.js';
import {
  parseQueryParams,
  isOwner,
  canDriverUpdateDelivery,
  canCustomerCancelDelivery,
  handleValidationError
} from '../utils/controllerUtils.js';

const DeliveryController = {
  async createRequest(req, res) {
    try {
      const delivery = await DeliveryService.createRequest(req.body, req.user.id, req.file);
      res.status(201).json(delivery);
    } catch (err) {
      const validationError = handleValidationError(err);
      if (validationError) return res.status(validationError.status).json({ error: validationError.error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async listPending(req, res) {
    try {
      const params = parseQueryParams(req.query);
      const data = await DeliveryService.listPending(params);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async acceptRequest(req, res) {
    try {
      const delivery = await DeliveryService.acceptRequest(req.params.id, req.user.id);
      if (!delivery) return res.status(400).json({ error: 'Request already accepted or not found' });
      res.json(delivery);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const { id: userId, role: userRole } = req.user;

      const delivery = await DeliveryService.findById(id);
      if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

      if (userRole === 'driver') {
        if (!canDriverUpdateDelivery(delivery, userId)) {
          return res.status(403).json({ error: 'Not authorized to update this delivery' });
        }
        const updated = await DeliveryService.updateDeliveryStatus(id, newStatus);
        return res.json(updated);
      }

      if (userRole === 'customer') {
        if (newStatus !== DELIVERY_STATUS[4]) {
          return res.status(403).json({ error: 'Customers can only cancel deliveries' });
        }
        if (!canCustomerCancelDelivery(delivery, userId)) {
          return res.status(403).json({ error: 'Cannot cancel this delivery' });
        }
        const updated = await DeliveryService.updateDeliveryStatus(id, newStatus);
        return res.json(updated);
      }

      return res.status(403).json({ error: 'Not authorized' });
    } catch (err) {
      res.status(400).json({ error: err.message || 'Status update failed' });
    }
  },

  async listForDriver(req, res) {
    try {
      const params = parseQueryParams(req.query);
      const data = await DeliveryService.listForDriver(req.user.id, params);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async listForCustomer(req, res) {
    try {
      const params = parseQueryParams(req.query);
      const data = await DeliveryService.listForCustomer(req.user.id, params);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async verifyDeliveryOtp(req, res) {
    try {
      const { id } = req.params;
      const { otp } = req.body;
      const { id: userId, role: userRole } = req.user;

      const delivery = await DeliveryService.findById(id);
      if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

      const isAuthorized = 
        (userRole === 'customer' && isOwner(delivery.customer, userId)) ||
        (userRole === 'driver' && isOwner(delivery.driver, userId));

      if (!isAuthorized) {
        return res.status(403).json({ error: 'Not authorized to verify OTP' });
      }

      const updated = await DeliveryService.verifyDeliveryOtp(id, otp);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message || 'OTP verification failed' });
    }
  },
  
  async getById(req, res) {
    try {
      const delivery = await DeliveryService.findById(req.params.id);
      if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
      res.json(delivery);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default DeliveryController;