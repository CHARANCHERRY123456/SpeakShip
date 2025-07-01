// src/features/delivery/components/DeliveryCardActions.jsx
import React from 'react';
import { CheckCircle, Truck as TruckIcon, PackageCheck, X } from 'lucide-react'; // Ensure lucide-react is installed
import LoadingButton from '../../../../../components/LoadingButton'; // Correct path

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
    cancelLoading,
    onInitiateDeliveryOtp, // For driver flow
    onVerifyDeliveryOtp,   // For driver flow
    isVerifyingOtp         // For driver flow
}) => {
    return (
        <>
            {/* Action Buttons for Driver View */}
            {isDriverView && !isDelivered && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                    {isPending && onAccept && (
                        <LoadingButton
                            onClick={() => onAccept(deliveryId)}
                            loading={isAccepting}
                            loadingText="Accepting..."
                            icon={CheckCircle} // Pass the CheckCircle icon component
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
                        >
                            Accept
                        </LoadingButton>
                    )}
                    {isAccepted && onUpdateStatus && (
                        <LoadingButton
                            onClick={() => onUpdateStatus('In-Transit')}
                            loading={updateLoading}
                            loadingText="Updating..."
                            icon={TruckIcon} // Pass the TruckIcon component
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${updateLoading ? 'opacity-70 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400'}`}
                        >
                            Mark as In-Transit
                        </LoadingButton>
                    )}
                    {isInTransit && onUpdateStatus && (
                        <LoadingButton
                            onClick={() => onUpdateStatus('Delivered')}
                            loading={updateLoading}
                            loadingText="Delivering..."
                            icon={PackageCheck} // Pass the PackageCheck icon component
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${updateLoading ? 'opacity-70 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-400'}`}
                        >
                            Mark as Delivered
                        </LoadingButton>
                    )}
                    {/* Add OTP related buttons here if needed, following the same pattern */}
                </div>
            )}

            {/* Customer Cancel Button (if allowed) */}
            {showCancel && (
                <LoadingButton
                    onClick={handleCancel}
                    loading={cancelLoading}
                    loadingText="Cancelling..."
                    icon={X} // Pass the X icon component
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors mt-2 ${cancelLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                    Cancel Delivery
                </LoadingButton>
            )}
        </>
    );
};

export default DeliveryCardActions;