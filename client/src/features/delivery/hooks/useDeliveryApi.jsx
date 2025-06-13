// src/features/delivery/hooks/useDeliveryApi.jsx
import { useState, useEffect, useCallback } from 'react';
import {
    fetchCustomerDeliveries,
    fetchPendingDeliveries,
    fetchDriverDeliveries,
    acceptDeliveryRequest,
    updateDeliveryStatus // Make sure this is imported
} from '../api';
import { useAuth } from '../../../contexts/AuthContext'; // To get current user role

const useDeliveryApi = (role) => {
    const { isAuthenticated, currentUser } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false); // For accepting deliveries
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // New state for status updates

    // Function to fetch deliveries based on role
    const getDeliveries = useCallback(async () => {
        if (!isAuthenticated || !currentUser) {
            setLoading(false);
            setDeliveries([]); // Clear deliveries if not authenticated
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let data = [];
            if (role === 'customer' && currentUser.role === 'customer') {
                data = await fetchCustomerDeliveries();
            } else if (role === 'driver' && currentUser.role === 'driver') {
                data = await fetchDriverDeliveries(); // Fetch driver's assigned deliveries
            } else {
                setError("You are not authorized to view this content.");
            }
            setDeliveries(data);
        } catch (err) {
            console.error(`Failed to fetch ${role} deliveries:`, err);
            setError(err.response?.data?.error || `Failed to load ${role} deliveries.`);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentUser, role]);

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
        loading,
        error,
        getDeliveries, // Expose refetch function
        handleAcceptDelivery,
        isAccepting,
        handleUpdateDeliveryStatus, // <--- THIS LINE WAS MISSING IN YOUR LOCAL FILE
        isUpdatingStatus            // <--- AND THIS LINE WAS MISSING
    };
};

export default useDeliveryApi;
