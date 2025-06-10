// src/features/delivery/controllers/DeliveryController.js
import DeliveryService from '../services/DeliveryService.js';

const DeliveryController = {
  async createRequest(req, res) {
    try {
      const customerId = req.user.id; // Assumes auth middleware sets req.user
      // Log incoming data for debugging
      console.log("Backend: createRequest received data:", req.body);
      console.log("Backend: customerId:", customerId);
      console.log("Backend: file data (req.file):", req.file);

      const delivery = await DeliveryService.createRequest(req.body, customerId, req.file);
      res.status(201).json(delivery);
    } catch (err) {
      // Log the full error to the backend console for debugging
      console.error("Backend Error in DeliveryController.createRequest:", err);

      // Check for specific Mongoose validation errors
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({
          error: `Validation failed: ${errors.join(', ')}`
        });
      }
      // For other unexpected errors, send a generic 500 error
      res.status(500).json({ error: 'Internal Server Error. Please check server logs for details.' });
    }
  },

  async listPending(req, res) {
    try {
      const deliveries = await DeliveryService.listPending();
      res.json(deliveries);
    } catch (err) {
      console.error("Backend Error in DeliveryController.listPending:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async acceptRequest(req, res) {
    try {
      const driverId = req.user.id; // Assumes auth middleware sets req.user
      const { id } = req.params;
      const delivery = await DeliveryService.acceptRequest(id, driverId);
      if (!delivery) return res.status(400).json({ error: 'Request already accepted or not found.' });
      res.json(delivery);
    } catch (err) {
      console.error("Backend Error in DeliveryController.acceptRequest:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async listForDriver(req, res) {
    try {
      const driverId = req.user.id;
      const deliveries = await DeliveryService.listForDriver(driverId);
      res.json(deliveries);
    } catch (err) {
      console.error("Backend Error in DeliveryController.listForDriver:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async listForCustomer(req, res) {
    try {
      const customerId = req.user.id;
      const deliveries = await DeliveryService.listForCustomer(customerId);
      res.json(deliveries);
    } catch (err) {
      console.error("Backend Error in DeliveryController.listForCustomer:", err);
      res.status(500).json({ error: err.message });
    }
  }
};

export default DeliveryController;
