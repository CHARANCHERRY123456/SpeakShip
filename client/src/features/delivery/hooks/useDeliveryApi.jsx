// src/features/delivery/hooks/useDeliveryApi.jsx
import { useState, useEffect, useCallback } from 'react';
import {
    fetchCustomerDeliveries,
    fetchDriverDeliveries,
    acceptDeliveryRequest,
    updateDeliveryStatus,
    verifyDeliveryOtp // Ensure this is imported
} from '../api';
import { useAuth } from '../../../contexts/AuthContext'; // To get current user role
import { toast } from 'react-hot-toast'; // Assuming you have toast for notifications

const useDeliveryApi = (role) => {
    const { isAuthenticated, currentUser } = useAuth();
    const [deliveries, setDeliveries] = useState([]);
    const [total, setTotal] = useState(0); // For pagination
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false); // For accepting deliveries
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // For In-Transit, Cancel, Initiate OTP
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // NEW: State for OTP verification loading

    // Pagination/filter state
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    // Function to fetch deliveries based on role, with pagination/filter
    // This function will also be called after mutations to refresh the list
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

            // Only fetch if currentUser.role matches the hook's intended role
            if (role === 'customer' && currentUser.role === 'customer') {
                data = await fetchCustomerDeliveries(params);
            } else if (role === 'driver' && currentUser.role === 'driver') {
                data = await fetchDriverDeliveries(params);
            } else if (role === 'admin') { // Assuming 'admin' role might view pending or all
                // Add your admin-specific fetch logic here, e.g., fetchAllDeliveries
                data = await fetchPendingDeliveries(params); // Example for admin viewing pending
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
    }, [isAuthenticated, currentUser, role, page, search, status]); // Dependencies updated

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
            toast.success('Delivery accepted successfully!');
            getDeliveries(); // <--- REFETCH THE LIST AFTER SUCCESS
            return acceptedDelivery;
        } catch (err) {
            console.error('Failed to accept delivery:', err);
            setError(err.response?.data?.error || 'Failed to accept delivery.');
            throw err; // Re-throw for component to catch
        } finally {
            setIsAccepting(false);
        }
    }, [role, currentUser, getDeliveries]);

    // Function to handle general status updates (e.g., In-Transit, Cancelled)
    const handleUpdateDeliveryStatus = useCallback(async (deliveryId, newStatus) => {
        // Authorize based on role and action
        const canUpdate = (role === 'driver' && currentUser?.role === 'driver') ||
                         (newStatus === 'Cancelled' && role === 'customer' && currentUser?.role === 'customer');

        if (!canUpdate) {
            setError("You are not authorized to update this delivery status.");
            return null;
        }

        setIsUpdatingStatus(true);
        setError(null);
        try {
            const updatedDelivery = await updateDeliveryStatus(deliveryId, newStatus);
            toast.success(`Delivery status updated to ${newStatus}!`);
            getDeliveries(); // <--- REFETCH THE LIST AFTER SUCCESS
            return updatedDelivery;
        } catch (err) {
            console.error('Failed to update delivery status:', err);
            setError(err.response?.data?.error || 'Failed to update delivery status.');
            throw err; // Re-throw for component to catch
        } finally {
            setIsUpdatingStatus(false);
        }
    }, [role, currentUser, getDeliveries]);

    // Function to initiate the OTP process (driver clicks "Mark as Delivered" first time)
    const handleInitiateDeliveryOtp = useCallback(async (deliveryId) => {
        if (role !== 'driver' || currentUser?.role !== 'driver') {
            setError("Only drivers can initiate delivery OTP.");
            throw new Error("Unauthorized to initiate delivery OTP."); // Throw error for frontend to catch
        }
        setIsUpdatingStatus(true); // Using this state for the initial status update
        setError(null);
        try {
            // This calls the backend's updateDeliveryStatus with 'Delivered'
            // which will trigger OTP generation/sending. Status remains In-Transit on DB.
            const initiatedDelivery = await updateDeliveryStatus(deliveryId, 'Delivered');
            // No toast here as the success message comes after OTP verification
            // No getDeliveries() call here, as status hasn't changed to 'Delivered' yet
            return initiatedDelivery;
        } catch (err) {
            console.error('Failed to initiate delivery OTP:', err);
            setError(err.response?.data?.error || 'Failed to initiate delivery OTP.');
            throw err; // Re-throw to allow component to catch and display specific error
        } finally {
            setIsUpdatingStatus(false);
        }
    }, [role, currentUser]);


    // NEW FUNCTION: Handle OTP verification and final delivery status update
    const handleVerifyDeliveryOtp = useCallback(async (deliveryId, otp) => {
        if (role !== 'driver' || currentUser?.role !== 'driver') { // Or adjust if customer can verify
            setError("You are not authorized to verify delivery OTP.");
            throw new Error("Unauthorized to verify delivery OTP.");
        }
        setIsVerifyingOtp(true); // Set loading state for OTP verification
        setError(null);
        try {
            const finalUpdatedDelivery = await verifyDeliveryOtp(deliveryId, otp);
            toast.success('Delivery confirmed and marked as delivered!'); // Specific success toast for OTP
            getDeliveries(); // <--- REFETCH THE LIST AFTER SUCCESS
            return finalUpdatedDelivery;
        } catch (err) {
            console.error('Failed to verify delivery OTP:', err);
            setError(err.response?.data?.error || 'Failed to verify delivery OTP.');
            throw err; // Re-throw to allow component to catch and display specific error (e.g., Invalid OTP)
        } finally {
            setIsVerifyingOtp(false);
        }
    }, [role, currentUser, getDeliveries]);


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
    }, [isAuthenticated, currentUser, role, getDeliveries, page, search, status]); // Added dependencies to re-run getDeliveries when filters change


    return {
        deliveries,
        total,
        loading,
        error,
        getDeliveries, // Expose getDeliveries for manual refetch if needed
        isAccepting,
        handleAcceptDelivery,
        isUpdatingStatus,
        isVerifyingOtp, // NEW: Export the OTP verification loading state
        handleInitiateDeliveryOtp, // NEW: Export for the initial "Mark as Delivered" click
        handleVerifyDeliveryOtp,   // NEW: Export for OTP input and verification
        handleUpdateDeliveryStatus, // Still available for other status changes (e.g., Cancelled, manual In-Transit)
        // Pagination/filter state setters
        page, setPage, search, setSearch, status, setStatus
    };
};

export default useDeliveryApi;