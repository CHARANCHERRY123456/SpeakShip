// src/features/delivery/api/index.jsx
import axios from '../../../api/axios'; // Use the pre-configured axios instance
import { API_BASE_URL } from '../../../constants/config';
import { DELIVERY_API_ROUTES } from '../constants';

/**
 * Creates a new delivery request.
 * @param {FormData} formData - FormData object containing delivery details including the photo file.
 * @returns {Promise<Object>} - The created delivery request object.
 */
export async function createDeliveryRequest(formData) {
    // No need to manually set token, axios instance handles it
    const response = await axios.post(DELIVERY_API_ROUTES.CREATE, formData);
    return response.data;
}

/**
 * Fetches all pending delivery requests (for drivers) with pagination and filtering.
 * @param {Object} params - { page, limit, search, status }
 * @returns {Promise<Object>} - { results, total }
 */
export async function fetchPendingDeliveries({ page = 1, search = '', status = '' } = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await axios.get(`${DELIVERY_API_ROUTES.PENDING}?${params.toString()}`);
    return response.data;
}

/**
 * Accepts a specific delivery request (for drivers).
 * @param {string} deliveryId - The ID of the delivery request to accept.
 * @returns {Promise<Object>} - The updated delivery request object.
 */
export async function acceptDeliveryRequest(deliveryId) {
    const response = await axios.post(`${DELIVERY_API_ROUTES.ACCEPT}/${deliveryId}`);
    return response.data;
}

/**
 * Updates the status of a specific delivery request.
 * @param {string} deliveryId - The ID of the delivery request to update.
 * @param {string} newStatus - The new status (e.g., 'Completed').
 * @returns {Promise<Object>} - The updated delivery request object.
 */
export async function updateDeliveryStatus(deliveryId, newStatus) {
    const response = await axios.patch(`/api/delivery/status/${deliveryId}`, { status: newStatus });
    return response.data;
}

/**
 * Cancel a delivery (customer only, allowed for Pending/Accepted)
 * @param {string} deliveryId - The ID of the delivery request to cancel.
 * @returns {Promise<Object>} - The updated delivery request object.
 */
export async function cancelDelivery(deliveryId) {
    const response = await axios.patch(`/api/delivery/status/${deliveryId}`, { status: 'Cancelled' });
    return response.data;
}

/**
 * Fetches all deliveries assigned to the current driver with pagination and filtering.
 * @param {Object} params - { page, limit, search, status }
 * @returns {Promise<Object>} - { results, total }
 */
export async function fetchDriverDeliveries({ page = 1, search = '', status = '' } = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await axios.get(`/api/delivery/my?${params.toString()}`);
    return response.data;
}

/**
 * Fetches all delivery requests made by the current customer with pagination and filtering.
 * @param {Object} params - { page, limit, search, status }
 * @returns {Promise<Object>} - { results, total }
 */
export async function fetchCustomerDeliveries({ page = 1, search = '', status = '' } = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await axios.get(`/api/delivery/customer?${params.toString()}`);
    return response.data;
}

/**
 * Verifies the delivery OTP for a specific delivery.
 * @param {string} deliveryId - The ID of the delivery request.
 * @param {string} otp - The OTP entered by the customer.
 * @returns {Promise<Object>} - The updated delivery request object.
 */
export async function verifyDeliveryOtp(deliveryId, otp) {
    const response = await axios.post(`/api/delivery/verify-otp/${deliveryId}`, { otp });
    return response.data;
}

/**
 * Fetch a single delivery by its ID.
 * @param {string} deliveryId - The ID of the delivery to fetch.
 * @returns {Promise<Object>} - The delivery object.
 */
export async function getDeliveryById(deliveryId) {
    const response = await axios.get(`/api/delivery/${deliveryId}`);
    return response.data;
}
