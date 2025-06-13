// src/features/delivery/pages/CustomerDeliveryPage.jsx
import React, { useEffect, useState } from 'react';
import CreateDeliveryForm from '../components/CreateDeliveryForm';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';

const CustomerDeliveryPage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const {
        deliveries: allMyDeliveries,
        loading: myDeliveriesLoading,
        error: myDeliveriesError,
        getDeliveries: getMyDeliveries,
    } = useDeliveryApi('customer');

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'in-transit', or 'completed'

    const [searchTerm, setSearchTerm] = useState(''); // NEW: State for search term
    const [filteredPendingAndAcceptedDeliveries, setFilteredPendingAndAcceptedDeliveries] = useState([]);
    const [filteredInTransitDeliveries, setFilteredInTransitDeliveries] = useState([]);
    const [filteredCompletedDeliveries, setFilteredCompletedDeliveries] = useState([]);

    // Effect to initially fetch data for all tabs when the component mounts or auth state changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.role === 'customer') {
            getMyDeliveries();
        }
    }, [isAuthenticated, currentUser, getMyDeliveries]);

    // Effect to filter all deliveries based on status and search term
    useEffect(() => {
        const applyFilters = (deliveriesToFilter) => {
            return deliveriesToFilter.filter(delivery => {
                const searchLower = searchTerm.toLowerCase();
                // Search by pickup/dropoff address, customer name, or delivery ID
                return (
                    delivery.pickupAddress.toLowerCase().includes(searchLower) ||
                    delivery.dropoffAddress.toLowerCase().includes(searchLower) ||
                    (delivery.name && delivery.name.toLowerCase().includes(searchLower)) ||
                    delivery._id.toLowerCase().includes(searchLower)
                );
            });
        };

        const pendingAndAccepted = allMyDeliveries.filter(d => d.status === 'Pending' || d.status === 'Accepted');
        const inTransit = allMyDeliveries.filter(d => d.status === 'In-Transit');
        const completed = allMyDeliveries.filter(d => d.status === 'Delivered');

        setFilteredPendingAndAcceptedDeliveries(applyFilters(pendingAndAccepted));
        setFilteredInTransitDeliveries(applyFilters(inTransit));
        setFilteredCompletedDeliveries(applyFilters(completed));

    }, [allMyDeliveries, searchTerm]); // Re-filter whenever allMyDeliveries or searchTerm changes

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Refresh deliveries when a new one is created
    const handleDeliveryCreated = () => {
        setShowCreateForm(false);
        getMyDeliveries();
    };

    if (!isAuthenticated || currentUser?.role !== 'customer') {
        return (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">
                You must be logged in as a customer to view this page.
            </div>
        );
    }

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

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search deliveries by address, name, or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 placeholder-gray-400 font-inter"
                />
            </div>

            {/* Tab Navigation for Customer - Responsive */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-gray-100 rounded-lg p-2 shadow-sm">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 sm:px-6 py-2.5 rounded-md font-semibold text-sm sm:text-lg transition-colors whitespace-nowrap ${
                        activeTab === 'active' ? 'bg-sky-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Pending/Accepted
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
            {activeTab === 'active' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Pending & Accepted Delivery Requests</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : filteredPendingAndAcceptedDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No pending or accepted delivery requests found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPendingAndAcceptedDeliveries.map(delivery => (
                                <DeliveryCard key={delivery._id} delivery={delivery} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'in-transit' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your In-Transit Deliveries</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your in-transit deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : filteredInTransitDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No deliveries currently in transit found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredInTransitDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'completed' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Completed Delivery Requests</h2>
                    {myDeliveriesLoading ? (
                        <div className="text-center py-8 text-gray-600">Loading your completed deliveries...</div>
                    ) : myDeliveriesError ? (
                        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
                    ) : filteredCompletedDeliveries.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            No completed delivery requests found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCompletedDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery._id}
                                    delivery={delivery}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomerDeliveryPage;
