// src/features/delivery/pages/CustomerDeliveryPage.jsx
import React, { useEffect, useState } from 'react';
import CreateDeliveryForm from '../components/CreateDeliveryForm';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';

const CustomerDeliveryPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const { deliveries, loading, error, getDeliveries } = useDeliveryApi('customer');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // --- DEBUGGING LOGS ---
    useEffect(() => {
        console.log("CustomerDeliveryPage - Check 1: isAuthenticated:", isAuthenticated);
        console.log("CustomerDeliveryPage - Check 1: currentUser:", currentUser);
        if (currentUser) {
            console.log("CustomerDeliveryPage - Check 1: currentUser.role:", currentUser.role);
        }
    }, [isAuthenticated, currentUser]);

    // Refresh deliveries when a new one is created
    const handleDeliveryCreated = () => {
        setShowCreateForm(false); // Hide the form after creation
        getDeliveries(); // Re-fetch the list of deliveries
    };

    // This condition determines if the "unauthorized" message is shown
    if (!isAuthenticated || currentUser?.role !== 'customer') {
        console.log("CustomerDeliveryPage - Render Path: Displaying unauthorized message.");
        console.log("Debug Info: isAuthenticated:", isAuthenticated, "currentUser?.role:", currentUser?.role);
        return (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">
                You must be logged in as a customer to view this page.
            </div>
        );
    }

    console.log("CustomerDeliveryPage - Render Path: Displaying main content.");

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Delivery Requests</h1>

            <div className="flex justify-center mb-8">
                <button
                    onClick={() => setShowCreateForm(prev => !prev)}
                    className="py-3 px-6 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors text-lg"
                >
                    {showCreateForm ? 'Hide Request Form' : 'Create New Delivery Request'}
                </button>
            </div>

            {showCreateForm && <CreateDeliveryForm onDeliveryCreated={handleDeliveryCreated} />}

            {loading ? (
                <div className="text-center py-8 text-gray-600">Loading your deliveries...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
            ) : deliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    You haven't made any delivery requests yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deliveries.map(delivery => (
                        <DeliveryCard key={delivery._id} delivery={delivery} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerDeliveryPage;
