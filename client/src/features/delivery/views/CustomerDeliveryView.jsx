// src/features/delivery/pages/CustomerDeliveryPage.jsx
import React, { useEffect, useState } from 'react';
import CreateDeliveryForm from '../components/CreateDeliveryForm';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';
import { filterDeliveries } from '../utils/deliveryFilters';
import { useCustomerDeliveryActions } from '../ui-actions/useCustomerDeliveryActions';
import LoadingSpinner from '../../../features/core/components/LoadingSpinner'
import { STATUS_OPTIONS, DELIVERY_MESSAGES } from '../constants';

export default function CustomerDeliveryView() {
    const { isAuthenticated, currentUser } = useAuth();
    const {deliveries: allMyDeliveries,loading: myDeliveriesLoading,
        error: myDeliveriesError,getDeliveries: getMyDeliveries,} = useDeliveryApi('customer');

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const {handleSearchChange,handleStatusChange,handleDeliveryCreated,handleToggleCreateForm} =
         useCustomerDeliveryActions({setSearchTerm,setStatusFilter,setShowCreateForm,getMyDeliveries});

    useEffect(() => {
        if (isAuthenticated && currentUser?.role === 'customer') {
            getMyDeliveries();
        }
    }, [isAuthenticated, currentUser, getMyDeliveries]);

    if (!isAuthenticated || currentUser?.role !== 'customer') {
        return (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">
                {DELIVERY_MESSAGES.notCustomer}
            </div>
        );
    }

    const filteredDeliveries = filterDeliveries(allMyDeliveries, searchTerm, statusFilter);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Delivery Requests</h1>
            <div className="flex justify-center mb-8">
                <button
                    onClick={handleToggleCreateForm}
                    className="py-3 px-6 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors text-lg"
                >
                    {showCreateForm ? 'Hide Request Form' : 'Create New Delivery Request'}
                </button>
            </div>
            {showCreateForm && <CreateDeliveryForm onDeliveryCreated={handleDeliveryCreated} />}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search deliveries by address, name, or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 placeholder-gray-400 font-inter"
                />
                <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 font-inter"
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
            {myDeliveriesLoading ? ( <LoadingSpinner />
            ) : myDeliveriesError ? (
                <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
            ) : filteredDeliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    {DELIVERY_MESSAGES.noDeliveries}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDeliveries.map(delivery => (
                        <DeliveryCard key={delivery._id} delivery={delivery} />
                    ))}
                </div>
            )}
        </div>
    );
};
