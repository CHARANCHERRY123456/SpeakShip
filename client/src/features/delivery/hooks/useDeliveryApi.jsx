// src/features/delivery/hooks/useDeliveryApi.jsx
import { useState, useEffect, useCallback } from 'react';
import {
    fetchCustomerDeliveries,
    fetchPendingDeliveries,
    fetchDriverDeliveries, // Ensure this is imported
    acceptDeliveryRequest
} from '../api';
import { useAuth } from '../../../contexts/AuthContext'; // To get current user role

const useDeliveryApi = (role) => {
    const { isAuthenticated, currentUser } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false); // For accepting deliveries

    // Function to fetch deliveries based on role
    const getDeliveries = useCallback(async () => {
        if (!isAuthenticated || !currentUser) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            let data = [];
            if (role === 'customer' && currentUser.role === 'customer') {
                data = await fetchCustomerDeliveries();
            } else if (role === 'driver' && currentUser.role === 'driver') {
                // CORRECTED: When useDeliveryApi is instantiated for a driver,
                // it should fetch the deliveries assigned to that driver.
                data = await fetchDriverDeliveries();
            } else {
                // If role doesn't match authenticated user's role or invalid role
                setError("You are not authorized to view this content.");
            }
            setDeliveries(data);
        } catch (err) {
            console.error(`Failed to fetch ${role} deliveries:`, err);
            setError(err.response?.data?.error || `Failed to load ${role} deliveries.`);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentUser, role]); // Re-fetch when getDeliveries callback changes (which depends on auth/role)

    // Function to accept a delivery request (only for drivers)
    const handleAcceptDelivery = useCallback(async (deliveryId) => {
        if (role !== 'driver' || currentUser?.role !== 'driver') {
            setError("Only drivers can accept deliveries.");
            return null; // Return null on error
        }
        setIsAccepting(true);
        setError(null);
        try {
            const acceptedDelivery = await acceptDeliveryRequest(deliveryId);
            // We no longer filter from pending list here, as DriverDeliveryPage handles pending separately.
            // DriverDeliveryPage will call getPendingDeliveries and getMyDeliveries again.
            return acceptedDelivery; // Return accepted delivery for potential re-rendering elsewhere
        } catch (err) {
            console.error('Failed to accept delivery:', err);
            setError(err.response?.data?.error || 'Failed to accept delivery.');
            return null;
        } finally {
            setIsAccepting(false);
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
        isAccepting
    };
};

export default useDeliveryApi;
