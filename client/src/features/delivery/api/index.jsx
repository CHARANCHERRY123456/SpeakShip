// src/features/delivery/api/index.jsx
import axios from '../../../api/axios'; // Import the pre-configured axios instance

/**
 * Creates a new delivery request.
 * @param {FormData} formData - FormData object containing delivery details including the photo file.
 * @returns {Promise<Object>} - The created delivery request object.
 */
export async function createDeliveryRequest(formData) {
    const token = localStorage.getItem('authToken'); // Get the authentication token
    // Axios automatically sets 'Content-Type': 'multipart/form-data' when a FormData object is passed.
    const response = await axios.post('/api/delivery/create', formData, {
        headers: {
            Authorization: `Bearer ${token}` // Attach the authorization token
        }
    });
    return response.data;
}

/**
 * Fetches all pending delivery requests (for drivers).
 * @returns {Promise<Array<Object>>} - An array of pending delivery request objects.
 */
export async function fetchPendingDeliveries() {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('/api/delivery/pending', {
        headers: {
            Authorization: `Bearer ${token}` // Ensure token is sent for authentication
        }
    });
    return response.data;
}

/**
 * Accepts a specific delivery request (for drivers).
 * @param {string} deliveryId - The ID of the delivery request to accept.
 * @returns {Promise<Object>} - The updated delivery request object.
 */
export async function acceptDeliveryRequest(deliveryId) {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`/api/delivery/accept/${deliveryId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

// NEW FUNCTION: Update delivery status
/**
 * Updates the status of a specific delivery request.
 * @param {string} deliveryId - The ID of the delivery request to update.
 * @param {string} newStatus - The new status (e.g., 'Completed').
 * @returns {Promise<Object>} - The updated delivery request object.
 */
export async function updateDeliveryStatus(deliveryId, newStatus) {
    const token = localStorage.getItem('authToken');
    const response = await axios.patch(`/api/delivery/status/${deliveryId}`, { status: newStatus }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}


/**
 * Fetches all deliveries assigned to the current driver.
 * @param {string} driverId - The ID of the driver (optional, can be inferred from token on backend).
 * @returns {Promise<Array<Object>>} - An array of delivery request objects assigned to the driver.
 */
export async function fetchDriverDeliveries() {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('/api/delivery/my', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

/**
 * Fetches all delivery requests made by the current customer.
 * @param {string} customerId - The ID of the customer (optional, can be inferred from token on backend).
 * @returns {Promise<Array<Object>>} - An array of delivery request objects made by the customer.
 */
export async function fetchCustomerDeliveries() {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('/api/delivery/customer', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
