// src/features/delivery/view/CustomerDeliveryView.jsx
import React, { useEffect, useState } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../../../features/core/components/LoadingSpinner';
import { STATUS_OPTIONS, DELIVERY_MESSAGES } from '../constants';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';


const CustomerDeliveryView = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const {
        deliveries,
        total,
        loading: myDeliveriesLoading,
        error: myDeliveriesError,
        getDeliveries: getMyDeliveries,
        page, setPage, search, setSearch, status, setStatus
    } = useDeliveryApi('customer');

    const [searchInput, setSearchInput] = useState(search);

    const handleSearchInputChange = e => setSearchInput(e.target.value);
    const handleSearchSubmit = e => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };
    const handleStatusChange = e => { 
        setStatus(e.target.value); 
        setPage(1); 
    };
    const handlePageChange = newPage => setPage(newPage);

    // Remove cancelled delivery from UI after cancel
    const handleCancel = () => {
        getMyDeliveries(); // Refresh list after cancel
    };

    useEffect(() => {
        if (isAuthenticated && currentUser?.role === 'customer') {
            getMyDeliveries();
        }
    }, [isAuthenticated, currentUser, getMyDeliveries, page, search, status]);

    if (!isAuthenticated || currentUser?.role !== 'customer') {
        return (
            <div className="text-center py-12 text-red-600 font-semibold text-lg">
                {DELIVERY_MESSAGES.notCustomer}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Your Delivery History
            </h1>
            
            {/* Centered Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center items-center">
                <form 
                    onSubmit={handleSearchSubmit}
                    className="relative w-full sm:w-auto sm:max-w-md"
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search deliveries..."
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 placeholder-gray-400 text-sm"
                    />
                </form>
                
                <div className="w-full sm:w-auto">
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="w-full sm:w-40 p-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 text-sm"
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Delivery list */}
            {myDeliveriesLoading ? (
                <LoadingSpinner />
            ) : myDeliveriesError ? (
                <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
            ) : deliveries.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                    {DELIVERY_MESSAGES.noDeliveries}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {deliveries.map(delivery => (
                            <DeliveryCard key={delivery._id} delivery={delivery} onCancel={handleCancel} />
                        ))}
                    </div>
                    
                    {/* Compact Pagination controls */}
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button 
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 1}
                            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm text-gray-700 px-3 py-1 bg-gray-100 rounded-lg">
                            Page {page} of {Math.ceil(total / 10) || 1}
                        </span>
                        <button 
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page * 10 >= total}
                            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomerDeliveryView;