// src/features/delivery/components/DeliveryCardModals.jsx
import React from 'react';
import DeliveryDetailsModal from './DeliveryDetailsModal';
import OtpModal from './OtpModal';

const DeliveryCardModals = ({
  showConfirmTransitModal,
  setShowConfirmTransitModal,
  showConfirmDeliveredModal,
  setShowConfirmDeliveredModal,
  showDetailsModal,
  toggleDetailsModal,
  shouldShowOtpEntry,
  otpInput,
  setOtpInput,
  otpLoading,
  otpError,
  handleOtpVerify,
  updateLoading,
  handleConfirmTransit,
  handleConfirmDelivered,
  delivery,
  onCloseOtpModal
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
              <button
                onClick={handleConfirmTransit}
                disabled={updateLoading}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${updateLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {updateLoading ? 'Confirming...' : 'Yes, Picked Up'}
              </button>
              <button
                onClick={() => setShowConfirmTransitModal(false)}
                disabled={updateLoading}
                className={`flex-1 py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors ${updateLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              <button
                onClick={handleConfirmDelivered}
                disabled={updateLoading}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${updateLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {updateLoading ? 'Completing...' : 'Yes, Mark Delivered'}
              </button>
              <button
                onClick={() => setShowConfirmDeliveredModal(false)}
                disabled={updateLoading}
                className={`flex-1 py-2 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors ${updateLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
      {/* OTP Entry Modal for Driver or Customer */}
      {shouldShowOtpEntry && (
        <OtpModal
          show={shouldShowOtpEntry}
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          otpLoading={otpLoading}
          otpError={otpError}
          onClose={onCloseOtpModal || (() => setOtpInput(''))}
          onSubmit={handleOtpVerify}
          packageName={delivery?.packageName}
        />
      )}
    </>
  );
};

export default DeliveryCardModals;
