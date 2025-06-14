import React, { useEffect, useState, useCallback } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPendingDeliveries } from '../api';
import { filterDriverDeliveries } from '../utils/driverDeliveryFilters';
import { useDriverDeliveryActions } from '../ui-actions/useDriverDeliveryActions';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'In-Transit', label: 'In-Transit' },
  { value: 'Delivered', label: 'Delivered' },
];

export default function DriverDeliveryView() {
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
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const getPendingDeliveries = useCallback(async () => {
    setPendingLoading(true);
    setPendingError(null);
    try {
      const data = await fetchPendingDeliveries();
      setPendingDeliveries(data);
    } catch (err) {
      setPendingError(err.response?.data?.error || 'Failed to load pending deliveries.');
    } finally {
      setPendingLoading(false);
    }
  }, []);

  // Modular UI actions
  const {
    handleSearchChange,
    handleStatusChange,
    onAcceptDelivery,
    onUpdateStatus
  } = useDriverDeliveryActions({
    setSearchTerm,
    setStatusFilter,
    handleAcceptDelivery,
    handleUpdateDeliveryStatus,
    getPendingDeliveries,
    getMyAssignedDeliveries
  });

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'driver') {
      getPendingDeliveries();
      getMyAssignedDeliveries();
    }
  }, [isAuthenticated, currentUser, getMyAssignedDeliveries, getPendingDeliveries]);

  if (!isAuthenticated || currentUser?.role !== 'driver') {
    return (
      <div className="text-center py-12 text-red-600 font-semibold text-lg">
        You must be logged in as a driver to view this page.
      </div>
    );
  }

  // Combine all deliveries for filtering
  const allDeliveries = [
    ...pendingDeliveries,
    ...allMyAssignedDeliveries.filter(d => d.status !== 'Pending')
  ];
  const filteredDeliveries = filterDriverDeliveries(allDeliveries, searchTerm, statusFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Driver Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search deliveries by address, customer, driver, or ID..."
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
      {pendingLoading || myDeliveriesLoading ? (
        <div className="text-center py-8 text-gray-600">Loading deliveries...</div>
      ) : pendingError || myDeliveriesError ? (
        <div className="text-center py-8 text-red-600">{pendingError || myDeliveriesError}</div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No delivery requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery._id}
              delivery={delivery}
              isDriverView={true}
              onAccept={onAcceptDelivery}
              isAccepting={isAccepting}
              onUpdateStatus={onUpdateStatus}
              updateLoading={isUpdatingStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
