// src/features/delivery/components/DeliveryCardActions.jsx
import React from 'react';
import { CheckCircle, Truck as TruckIcon, PackageCheck, X } from 'lucide-react';

const DeliveryCardActions = ({
  isDriverView,
  isDelivered,
  isPending,
  isAccepted,
  isInTransit,
  onAccept,
  onUpdateStatus,
  updateLoading,
  isAccepting,
  deliveryId,
  showCancel,
  handleCancel,
  cancelLoading
}) => {
  return (
    <>
      {/* Action Buttons for Driver View (always visible at bottom if not delivered) */}
      {isDriverView && !isDelivered && (
        <div className="mt-4 space-y-2">
          {isPending && onAccept && (
            <button
              onClick={() => onAccept(deliveryId)}
              disabled={isAccepting}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors ${
                isAccepting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isAccepting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" /> Accept
                </>
              )}
            </button>
          )}
          {isAccepted && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus('In-Transit')}
              disabled={updateLoading}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${
                updateLoading ? 'opacity-70 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {updateLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <TruckIcon className="h-4 w-4" /> Mark as In-Transit
                </>
              )}
            </button>
          )}
          {isInTransit && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus('Delivered')}
              disabled={updateLoading}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${
                updateLoading ? 'opacity-70 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {updateLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Delivering...
                </>
              ) : (
                <>
                  <PackageCheck className="h-4 w-4" /> Mark as Delivered
                </>
              )}
            </button>
          )}
        </div>
      )}
      {/* Customer Cancel Button (if allowed) */}
      {showCancel && (
        <button
          onClick={handleCancel}
          disabled={cancelLoading}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors mt-2 ${cancelLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {cancelLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cancelling...
            </>
          ) : (
            <>
              <X className="h-4 w-4" /> Cancel Delivery
            </>
          )}
        </button>
      )}
    </>
  );
};

export default DeliveryCardActions;
