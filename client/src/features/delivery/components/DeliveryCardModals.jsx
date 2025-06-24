// src/features/delivery/components/DeliveryCardModals.jsx
import React from 'react';
import DeliveryDetailsModal from './DeliveryDetailsModal';
import LoadingButton from '../../../components/LoadingButton';

const DeliveryCardModals = ({
  showConfirmTransitModal,
  setShowConfirmTransitModal,
  showConfirmDeliveredModal,
  setShowConfirmDeliveredModal,
  showDetailsModal,
  toggleDetailsModal,
  updateLoading,
  handleConfirmTransit,
  handleConfirmDelivered,
  delivery
}) => {
  return (
    <>
      {/* Confirmation Modal for In-Transit */}
      {showConfirmTransitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Confirm Parcel Pickup</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Have you physically picked up the parcel for this delivery?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <LoadingButton
                onClick={handleConfirmTransit}
                loading={updateLoading}
                loadingText="Confirming..."
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: updateLoading ? '#a78bfa' : '#7c3aed' }}
              >
                Yes, Picked Up
              </LoadingButton>
              <button
                onClick={() => setShowConfirmTransitModal(false)}
                disabled={updateLoading}
                className="flex-1 py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal for Delivered */}
      {showConfirmDeliveredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Confirm Delivery Completion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to mark this delivery as 'Delivered'?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <LoadingButton
                onClick={handleConfirmDelivered}
                loading={updateLoading}
                loadingText="Completing..."
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: updateLoading ? '#6ee7b7' : '#059669' }}
              >
                Yes, Mark Delivered
              </LoadingButton>
              <button
                onClick={() => setShowConfirmDeliveredModal(false)}
                disabled={updateLoading}
                className="flex-1 py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Full Details Modal */}
      {showDetailsModal && (
        <DeliveryDetailsModal delivery={delivery} onClose={toggleDetailsModal} />
      )}
      {/* OTP Entry Modal for Customer */}
      {/* Removed: OTP modal is now handled in DeliveryCard for driver flow */}
    </>
  );
};

export default DeliveryCardModals;
