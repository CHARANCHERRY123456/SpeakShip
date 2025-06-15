import DeliveryService from '../services/DeliveryService.js';

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
      const driverId = req.user.id;
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const driverIdString = driverId.toString();
      const delivery = await DeliveryService.findById(id);
      if (!delivery) {
        return res.status(404).json({ error: 'Delivery request not found.' });
      }
      if (!delivery.driver || delivery.driver._id.toString() !== driverIdString) {
        return res.status(403).json({ error: 'Not authorized to update this delivery.' });
      }
      const updatedDelivery = await DeliveryService.updateDeliveryStatus(id, newStatus);
      res.json(updatedDelivery);
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
  }
};

export default DeliveryController;
