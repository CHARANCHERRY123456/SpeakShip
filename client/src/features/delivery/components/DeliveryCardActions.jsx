// src/features/delivery/components/DeliveryCardActions.jsx
import React from 'react';
import { CheckCircle, Truck as TruckIcon, PackageCheck, X } from 'lucide-react';
import LoadingButton from '../../../components/LoadingButton';

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
            <LoadingButton
              onClick={() => onAccept(deliveryId)}
              loading={isAccepting}
              loadingText="Accepting..."
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors"
            >
              <CheckCircle className="h-4 w-4" /> Accept
            </LoadingButton>
          )}
          {isAccepted && onUpdateStatus && (
            <LoadingButton
              onClick={() => onUpdateStatus('In-Transit')}
              loading={updateLoading}
              loadingText="Updating..."
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${updateLoading ? 'opacity-70 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              <TruckIcon className="h-4 w-4" /> Mark as In-Transit
            </LoadingButton>
          )}
          {isInTransit && onUpdateStatus && (
            <LoadingButton
              onClick={() => onUpdateStatus('Delivered')}
              loading={updateLoading}
              loadingText="Delivering..."
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${updateLoading ? 'opacity-70 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              <PackageCheck className="h-4 w-4" /> Mark as Delivered
            </LoadingButton>
          )}
        </div>
      )}
      {/* Customer Cancel Button (if allowed) */}
      {showCancel && (
        <LoadingButton
          onClick={handleCancel}
          loading={cancelLoading}
          loadingText="Cancelling..."
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors mt-2 ${cancelLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          <X className="h-4 w-4" /> Cancel Delivery
        </LoadingButton>
      )}
    </>
  );
};

export default DeliveryCardActions;
