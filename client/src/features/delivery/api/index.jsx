// src/features/delivery/api/index.jsx
import axios from '../../../api/axios';
import { API_BASE_URL } from '../../../constants/config';
import { DELIVERY_API_ROUTES } from '../constants';

/**
 * Creates a new delivery request.
 * @param {FormData} formData - FormData object containing delivery details including the photo file.
 * @returns {Promise<Object>} - The created delivery request object.
 */
export async function createDeliveryRequest(formData) {
    const token = localStorage.getItem('authToken'); // Get the authentication token
    // Axios automatically sets 'Content-Type': 'multipart/form-data' when a FormData object is passed.
    const response = await axios.post(DELIVERY_API_ROUTES.CREATE, formData, {
        headers: {
            Authorization: `Bearer ${token}` // Attach the authorization token
        }
    });
    return response.data;
}

/**
 * Fetches all pending delivery requests (for drivers) with pagination and filtering.
 * @param {Object} params - { page, limit, search, status }
 * @returns {Promise<Object>} - { results, total }
 */
export async function fetchPendingDeliveries({ page = 1, search = '', status = '' } = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await axios.get(`${DELIVERY_API_ROUTES.PENDING}?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
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
    const response = await axios.post(`${DELIVERY_API_ROUTES.ACCEPT}/${deliveryId}`, {}, {
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
 * Fetches all deliveries assigned to the current driver with pagination and filtering.
 * @param {Object} params - { page, limit, search, status }
 * @returns {Promise<Object>} - { results, total }
 */
export async function fetchDriverDeliveries({ page = 1, search = '', status = '' } = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await axios.get(`/api/delivery/my?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

/**
 * Fetches all delivery requests made by the current customer with pagination and filtering.
 * @param {Object} params - { page, limit, search, status }
 * @returns {Promise<Object>} - { results, total }
 */
export async function fetchCustomerDeliveries({ page = 1, search = '', status = '' } = {}) {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await axios.get(`/api/delivery/customer?${params.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
