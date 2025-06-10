// src/features/delivery/pages/DriverDeliveryPage.jsx
import React, { useState, useEffect } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPendingDeliveries, fetchDriverDeliveries } from '../api'; // Import direct API calls

const DriverDeliveryPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    // useDeliveryApi will primarily manage accepted deliveries or just act as the base hook
    // For pending, we'll use a direct fetch to manage its specific state.
    const { deliveries: myDeliveries, loading: myDeliveriesLoading, error: myDeliveriesError, getDeliveries: getMyDeliveries, handleAcceptDelivery, isAccepting } = useDeliveryApi('driver');

    const [pendingDeliveries, setPendingDeliveries] = useState([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [pendingError, setPendingError] = useState(null);

    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'my'

    const getPendingDeliveries = async () => {
        setPendingLoading(true);
        setPendingError(null);
        try {
            const data = await fetchPendingDeliveries();
            setPendingDeliveries(data);
        } catch (err) {
            console.error("Failed to fetch pending deliveries:", err);
            setPendingError(err.response?.data?.error || 'Failed to load pending deliveries.');
        } finally {
            setPendingLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && currentUser?.role === 'driver') {
            getPendingDeliveries(); // Fetch pending on initial load
            getMyDeliveries(); // Fetch my accepted deliveries
        }
    }, [isAuthenticated, currentUser, getMyDeliveries]); // Re-fetch on auth state changes

    const onAcceptDelivery = async (deliveryId) => {
        const accepted = await handleAcceptDelivery(deliveryId); // Call hook's accept logic
        if (accepted) {
            getPendingDeliveries(); // Re-fetch pending to remove the accepted one
            getMyDeliveries(); // Re-fetch my deliveries to add the accepted one
        }
    };

    if (!isAuthenticated || currentUser?.role !== 'driver') {
        return (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">
                You must be logged in as a driver to view this page.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Driver Dashboard</h1>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8 bg-gray-100 rounded-lg p-2 shadow-sm">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-6 py-2.5 rounded-md font-semibold transition-colors text-lg ${
                        activeTab === 'pending' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Pending Requests
                </button>
                <button
                    onClick={() => setActiveTab('my')}
                    className={`ml-4 px-6 py-2.5 rounded-md font-semibold transition-colors text-lg ${
                        activeTab === 'my' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    My Accepted Deliveries
                </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'pending' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Available Deliveries to Accept</h2>
                    {pendingLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading pending deliveries...</div>
                    ) : pendingError ? (
                        <div className="text-center py-8 text-red-600">{pendingError}</div>
                    ) : pendingDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No pending delivery requests available at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                    isDriverView={true}
                                    onAccept={onAcceptDelivery}
                                    isAccepting={isAccepting} // Pass loading state to card if needed
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'my' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Accepted Deliveries</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your accepted deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : myDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            You haven't accepted any deliveries yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                    isDriverView={true} // Still driver view, but without accept button logic here
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DriverDeliveryPage;
