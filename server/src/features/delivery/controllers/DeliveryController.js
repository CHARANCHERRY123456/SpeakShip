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
      console.error("Backend Error in DeliveryController.acceptRequest:", err);
      res.status(400).json({ error: err.message });
    }
  },

  // Update delivery status
  async updateStatus(req, res) {
    try {
      const driverId = req.user.id; // Assumes auth middleware sets req.user
      const { id } = req.params;
      const { status: newStatus } = req.body; // Expect new status in request body

      console.log(`Backend: Update status for delivery ID: ${id} to new status: ${newStatus}`);
      // Corrected: Ensure driverId is a string for consistent logging and comparison
      const driverIdString = driverId.toString();
      console.log(`Backend: Driver attempting update: ${driverIdString}`);


      // Check if the delivery is assigned to this driver before allowing status update (security)
      const delivery = await DeliveryService.findById(id); // Use findById from service/repo
      if (!delivery) {
          console.warn(`Backend: Delivery not found for ID: ${id}`);
          return res.status(404).json({ error: 'Delivery request not found.' }); // Return 404 if not found
      }

      // --- NEW DEBUGGING LOGS FOR COMPARISON ---
      console.log(`Backend Debug: driverId (from token): '${driverIdString}' (length: ${driverIdString.length}, type: ${typeof driverIdString})`);
      if (delivery.driver) {
          console.log(`Backend Debug: delivery.driver (populated object): ${JSON.stringify(delivery.driver)}`);
          console.log(`Backend Debug: delivery.driver._id (ObjectId): '${delivery.driver._id}' (length: ${delivery.driver._id.toString().length}, type: ${typeof delivery.driver._id})`);
          console.log(`Backend Debug: delivery.driver._id.toString(): '${delivery.driver._id.toString()}'`);
          console.log(`Backend Debug: Comparison result (delivery.driver._id.toString() === driverIdString): ${delivery.driver._id.toString() === driverIdString}`); // Use driverIdString here
      } else {
          console.warn(`Backend Debug: delivery.driver is null or undefined!`);
      }
      // --- END NEW DEBUGGING LOGS ---

      // The core authorization check
      // CORRECTED: Compare the string version of driverId
      if (!delivery.driver || delivery.driver._id.toString() !== driverIdString) { // Use driverIdString here
        // If we reach here, it means authorization failed.
        console.warn(`Backend: Authorization failed for delivery ${id}.`);
        console.warn(`  Driver ID from token: '${driverIdString}'`); // Use driverIdString here
        console.warn(`  Assigned Driver ID from delivery: '${delivery.driver?._id?.toString()}'`);
        return res.status(403).json({ error: 'Not authorized to update this delivery.' });
      }

      const updatedDelivery = await DeliveryService.updateDeliveryStatus(id, newStatus);
      res.json(updatedDelivery);
    } catch (err) {
      // Log the full error to the backend console for debugging
      console.error("Backend Error in DeliveryController.updateStatus:", err);
      // Return the specific error message from the backend if available, otherwise a generic one
      res.status(400).json({ error: err.message || 'Bad Request: Unknown error during status update.' });
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
