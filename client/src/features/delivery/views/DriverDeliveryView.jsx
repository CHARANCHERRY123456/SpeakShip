import React, { useEffect } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import useDeliveryApi from '../hooks/useDeliveryApi';
import { useAuth } from '../../../contexts/AuthContext';

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
    deliveries,
    total,
    loading: myDeliveriesLoading,
    error: myDeliveriesError,
    getDeliveries: getMyAssignedDeliveries,
    page, setPage, search, setSearch, status, setStatus,
    handleAcceptDelivery,
    isAccepting,
    handleUpdateDeliveryStatus,
    isUpdatingStatus
  } = useDeliveryApi('driver');

  // Handlers for search and status
  const handleSearchChange = e => { setSearch(e.target.value); setPage(1); };
  const handleStatusChange = e => { setStatus(e.target.value); setPage(1); };
  // const handleLimitChange = e => { setLimit(Number(e.target.value)); setPage(1); };
  const handlePageChange = newPage => setPage(newPage);

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'driver') {
      getMyAssignedDeliveries();
    }
  }, [isAuthenticated, currentUser, getMyAssignedDeliveries, page, search, status]);

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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search deliveries by address, customer, driver, or ID..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 placeholder-gray-400 font-inter"
        />
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-gray-900 font-inter"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {myDeliveriesLoading ? (
        <div className="text-center py-8 text-gray-600">Loading deliveries...</div>
      ) : myDeliveriesError ? (
        <div className="text-center py-8 text-red-600">{myDeliveriesError}</div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No delivery requests found.</div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveries.map(delivery => (
            <DeliveryCard
              key={delivery._id}
              delivery={delivery}
              isDriverView={true}
              onAccept={handleAcceptDelivery}
              isAccepting={isAccepting}
              onUpdateStatus={handleUpdateDeliveryStatus}
              updateLoading={isUpdatingStatus}
            />
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-3 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Prev</button>
          <span>Page {page} of {Math.ceil(total / 10) || 1}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page * 10 >= total} className="px-3 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50">Next</button>
        </div>
        </>
      )}
    </div>
  );
}
