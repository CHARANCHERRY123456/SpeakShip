import DeliveryService from '../services/DeliveryService.js';

const DeliveryController = {
  async createRequest(req, res) {
    try {
      const customerId = req.user.id; // Assumes auth middleware sets req.user
      const delivery = await DeliveryService.createRequest(req.body, customerId, req.file);
      res.status(201).json(delivery);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listPending(req, res) {
    try {
      const deliveries = await DeliveryService.listPending();
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
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
      res.status(400).json({ error: err.message });
    }
  },

  async listForDriver(req, res) {
    try {
      const driverId = req.user.id;
      const deliveries = await DeliveryService.listForDriver(driverId);
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async listForCustomer(req, res) {
    try {
      const customerId = req.user.id;
      const deliveries = await DeliveryService.listForCustomer(customerId);
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default DeliveryController;
