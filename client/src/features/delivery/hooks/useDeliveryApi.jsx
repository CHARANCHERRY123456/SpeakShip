// src/features/delivery/hooks/useDeliveryApi.jsx
import { useState, useEffect, useCallback } from 'react';
import {
    fetchCustomerDeliveries,
    fetchDriverDeliveries,
    acceptDeliveryRequest,
    updateDeliveryStatus // Make sure this is imported
} from '../api';
import { useAuth } from '../../../contexts/AuthContext'; // To get current user role

const useDeliveryApi = (role) => {
    const { isAuthenticated, currentUser } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [total, setTotal] = useState(0); // For pagination
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false); // For accepting deliveries
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // New state for status updates
    // Pagination/filter state
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    // Function to fetch deliveries based on role, with pagination/filter
    const getDeliveries = useCallback(async (override = {}) => {
        if (!isAuthenticated || !currentUser) {
            setLoading(false);
            setDeliveries([]);
            setTotal(0);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            let data = { results: [], total: 0 };
            const params = {
                page: override.page || page,
                search: override.search !== undefined ? override.search : search,
                status: override.status !== undefined ? override.status : status
            };
            if (role === 'customer' && currentUser.role === 'customer') {
                data = await fetchCustomerDeliveries(params);
            } else if (role === 'driver' && currentUser.role === 'driver') {
                data = await fetchDriverDeliveries(params);
            } else {
                setError('You are not authorized to view this content.');
            }
            setDeliveries(Array.isArray(data.results) ? data.results : []);
            setTotal(typeof data.total === 'number' ? data.total : 0);
        } catch (err) {
            console.error(`Failed to fetch ${role} deliveries:`, err);
            setError(err.response?.data?.error || `Failed to load ${role} deliveries.`);
            setDeliveries([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentUser, role, page, search, status]);

    // Function to accept a delivery request (only for drivers)
    const handleAcceptDelivery = useCallback(async (deliveryId) => {
        if (role !== 'driver' || currentUser?.role !== 'driver') {
            setError("Only drivers can accept deliveries.");
            return null;
        }
        setIsAccepting(true);
        setError(null);
        try {
            const acceptedDelivery = await acceptDeliveryRequest(deliveryId);
            return acceptedDelivery;
        } catch (err) {
            console.error('Failed to accept delivery:', err);
            setError(err.response?.data?.error || 'Failed to accept delivery.');
            return null;
        } finally {
            setIsAccepting(false);
        }
    }, [role, currentUser]);

    // NEW FUNCTION: Handle updating delivery status
    const handleUpdateDeliveryStatus = useCallback(async (deliveryId, newStatus) => {
        if (role !== 'driver' || currentUser?.role !== 'driver') {
            setError("Only drivers can update delivery status.");
            return null;
        }
        setIsUpdatingStatus(true);
        setError(null);
        try {
            const updatedDelivery = await updateDeliveryStatus(deliveryId, newStatus);
            // Update the local state to reflect the status change immediately
            setDeliveries(prev =>
                prev.map(d => (d._id === updatedDelivery._id ? updatedDelivery : d))
            );
            return updatedDelivery;
        } catch (err) {
            console.error('Failed to update delivery status:', err);
            setError(err.response?.data?.error || 'Failed to update delivery status.');
            return null;
        } finally {
            setIsUpdatingStatus(false);
        }
    }, [role, currentUser]);


    useEffect(() => {
        // Only fetch if authenticated and user role matches the hook's intended role
        if (isAuthenticated && currentUser && currentUser.role === role) {
            getDeliveries();
        } else if (!isAuthenticated || !currentUser) {
            // Reset state if not authenticated or user data is missing
            setDeliveries([]);
            setLoading(false);
            setError(null);
        }
    }, [isAuthenticated, currentUser, role, getDeliveries]);

    return {
        deliveries,
        total,
        loading,
        error,
        getDeliveries,
        isAccepting,
        handleAcceptDelivery,
        isUpdatingStatus,
        handleUpdateDeliveryStatus,
        // Pagination/filter state setters
        page, setPage, search, setSearch, status, setStatus
    };
};

export default useDeliveryApi;
