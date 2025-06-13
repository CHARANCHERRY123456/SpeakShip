// src/features/delivery/pages/DriverDeliveryPage.jsx
import React, { useState, useEffect } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPendingDeliveries } from '../api'; // Import direct API calls for pending list

const DriverDeliveryPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const {
        deliveries: allMyAssignedDeliveries,
        loading: myDeliveriesLoading,
        error: myDeliveriesError,
        getDeliveries: getMyAssignedDeliveries,
        handleAcceptDelivery,
        isAccepting,
        handleUpdateDeliveryStatus,
        isUpdatingStatus
    } = useDeliveryApi('driver');

    const [pendingDeliveries, setPendingDeliveries] = useState([]);
    const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
    const [inTransitDeliveries, setInTransitDeliveries] = useState([]);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);

    const [pendingLoading, setPendingLoading] = useState(true);
    const [pendingError, setPendingError] = useState(null);

    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'accepted', 'in-transit', or 'completed'
    const [searchTerm, setSearchTerm] = useState(''); // NEW: State for search term

    const [filteredPendingDeliveries, setFilteredPendingDeliveries] = useState([]);
    const [filteredAcceptedDeliveries, setFilteredAcceptedDeliveries] = useState([]);
    const [filteredInTransitDeliveries, setFilteredInTransitDeliveries] = useState([]);
    const [filteredCompletedDeliveries, setFilteredCompletedDeliveries] = useState([]);

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
            getPendingDeliveries();
            getMyAssignedDeliveries();
        }
    }, [isAuthenticated, currentUser, getMyAssignedDeliveries]);

    // Effect to filter all deliveries based on status and search term
    useEffect(() => {
        const applyFilters = (deliveriesToFilter) => {
            return deliveriesToFilter.filter(delivery => {
                const searchLower = searchTerm.toLowerCase();
                // Search by pickup/dropoff address, customer name, driver name or delivery ID
                // Note: delivery.name is the customer's name at the time of request
                const customerName = delivery.name ? delivery.name.toLowerCase() : '';
                const driverName = (delivery.driver && typeof delivery.driver === 'object') ? (delivery.driver.name || delivery.driver.username || '').toLowerCase() : '';

                return (
                    delivery.pickupAddress.toLowerCase().includes(searchLower) ||
                    delivery.dropoffAddress.toLowerCase().includes(searchLower) ||
                    customerName.includes(searchLower) ||
                    driverName.includes(searchLower) ||
                    delivery._id.toLowerCase().includes(searchLower)
                );
            });
        };

        // Filter for each tab based on its status and the search term
        const pending = pendingDeliveries.filter(d => d.status === 'Pending');
        const accepted = allMyAssignedDeliveries.filter(d => d.status === 'Accepted');
        const inTransit = allMyAssignedDeliveries.filter(d => d.status === 'In-Transit');
        const completed = allMyAssignedDeliveries.filter(d => d.status === 'Delivered');

        setFilteredPendingDeliveries(applyFilters(pending));
        setFilteredAcceptedDeliveries(applyFilters(accepted));
        setFilteredInTransitDeliveries(applyFilters(inTransit));
        setFilteredCompletedDeliveries(applyFilters(completed));

    }, [pendingDeliveries, allMyAssignedDeliveries, searchTerm]); // Re-filter whenever source data or searchTerm changes

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onAcceptDelivery = async (deliveryId) => {
        console.log(`DriverDeliveryPage: Attempting to accept delivery ${deliveryId}`);
        const accepted = await handleAcceptDelivery(deliveryId);
        if (accepted) {
            console.log(`Delivery ${deliveryId} accepted successfully.`);
            getPendingDeliveries();
            getMyAssignedDeliveries();
        } else {
            console.log(`Delivery ${deliveryId} acceptance failed.`);
        }
    };

    const onUpdateStatus = async (deliveryId, newStatus) => {
        console.log(`DriverDeliveryPage: Attempting to update delivery ${deliveryId} to status: ${newStatus}.`);
        const updated = await handleUpdateDeliveryStatus(deliveryId, newStatus);
        if (updated) {
            console.log(`Delivery ${deliveryId} status successfully updated to ${newStatus}.`);
            // The hook updates its internal state, which triggers the filtering useEffect
        } else {
            console.log(`Delivery ${deliveryId} status update failed.`);
        }
    };


    if (!isAuthenticated || currentUser?.role !== 'driver') {
        console.log("DriverDeliveryPage: Not authenticated as driver or role mismatch.");
        return (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">
                You must be logged in as a driver to view this page.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Driver Dashboard</h1>

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search deliveries by address, customer, or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 placeholder-gray-400 font-inter"
                />
            </div>

            {/* Tab Navigation - Responsive */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-100 rounded-lg p-2 shadow-sm">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm sm:text-lg transition-colors whitespace-nowrap ${
                        activeTab === 'pending' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Pending Requests
                </button>
                <button
                    onClick={() => setActiveTab('accepted')}
                    className={`px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm sm:text-lg transition-colors whitespace-nowrap ${
                        activeTab === 'accepted' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Accepted
                </button>
                <button
                    onClick={() => setActiveTab('in-transit')}
                    className={`px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm sm:text-lg transition-colors whitespace-nowrap ${
                        activeTab === 'in-transit' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    In-Transit
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm sm:text-lg transition-colors whitespace-nowrap ${
                        activeTab === 'completed' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Completed
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
                    ) : filteredPendingDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No pending delivery requests available at the moment.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPendingDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                    isDriverView={true}
                                    onAccept={onAcceptDelivery}
                                    isAccepting={isAccepting}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'accepted' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Accepted Deliveries (Awaiting Pickup)</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your accepted deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : filteredAcceptedDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No deliveries awaiting pickup.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAcceptedDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                    isDriverView={true}
                                    onUpdateStatus={onUpdateStatus}
                                    updateLoading={isUpdatingStatus}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'in-transit' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Deliveries In-Transit</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your in-transit deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : filteredInTransitDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No deliveries currently in transit.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredInTransitDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                    isDriverView={true}
                                    onUpdateStatus={onUpdateStatus}
                                    updateLoading={isUpdatingStatus}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'completed' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">My Completed Deliveries</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your completed deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : filteredCompletedDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            You haven't completed any deliveries yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCompletedDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                    isDriverView={true}
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
