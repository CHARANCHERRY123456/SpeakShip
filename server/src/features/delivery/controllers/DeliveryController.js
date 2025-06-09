import DeliveryRepository from '../repository/DeliveryRepository.js';

const DeliveryController = {
  async createRequest(req, res) {
    try {
      const customerId = req.user.id; // Assumes auth middleware sets req.user
      const data = {
        ...req.body,
        customer: customerId,
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      if (req.file) {
        data.photoUrl = `/uploads/${req.file.filename}`;
      }
      const delivery = await DeliveryRepository.create(data);
      res.status(201).json(delivery);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listPending(req, res) {
    try {
      const deliveries = await DeliveryRepository.findPending();
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async acceptRequest(req, res) {
    try {
      const driverId = req.user.id; // Assumes auth middleware sets req.user
      const { id } = req.params;
      const delivery = await DeliveryRepository.acceptRequest(id, driverId);
      if (!delivery) return res.status(400).json({ error: 'Request already accepted or not found.' });
      res.json(delivery);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listForDriver(req, res) {
    try {
      const driverId = req.user.id;
      const deliveries = await DeliveryRepository.findByDriver(driverId);
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async listForCustomer(req, res) {
    try {
      const customerId = req.user.id;
      const deliveries = await DeliveryRepository.findByCustomer(customerId);
      res.json(deliveries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default DeliveryController;
