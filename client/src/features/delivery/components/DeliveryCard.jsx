// src/features/delivery/components/DeliveryCard.jsx
import React, { useState } from 'react';
import { 
    MapPin, Mail, Phone, Notebook, Camera, 
    Truck, User, Calendar, CheckCircle, 
    Tag, PackageCheck, Truck as TruckIcon, ChevronDown, ChevronUp, X // Added X for close button
} from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';
import { cancelDelivery, verifyDeliveryOtp } from '../api/index';
import { toast } from 'react-hot-toast';
import StatusBadge from './StatusBadge';
import DeliveryDetailsModal from './DeliveryDetailsModal';
import OtpModal from './OtpModal';
import { useNavigate } from 'react-router-dom';

const DeliveryCard = ({ delivery, isDriverView = false, onAccept, onUpdateStatus, updateLoading = false, isAccepting = false, onCancel }) => {
    const [showConfirmTransitModal, setShowConfirmTransitModal] = useState(false);
    const [showConfirmDeliveredModal, setShowConfirmDeliveredModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false); // New state for the full details modal
    const [cancelLoading, setCancelLoading] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const navigate = useNavigate();

    const defaultPlaceholder = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';
    const fullPhotoUrl = delivery.photoUrl ? (delivery.photoUrl.startsWith('http') ? delivery.photoUrl : `${API_BASE_URL}${delivery.photoUrl}`) : defaultPlaceholder;

    // Toggle function for the new details modal
    const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);

    const handleConfirmTransit = () => {
        setShowConfirmTransitModal(false);
        if (onUpdateStatus) {
            onUpdateStatus(delivery._id, 'In-Transit');
        }
    };

    const handleConfirmDelivered = () => {
        setShowConfirmDeliveredModal(false);
        if (onUpdateStatus) {
            onUpdateStatus(delivery._id, 'Delivered');
        }
    };

    const handleCancel = async () => {
        setCancelLoading(true);
        try {
            await cancelDelivery(delivery._id);
            toast.success('Delivery cancelled successfully.');
            if (onCancel) onCancel(delivery._id);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to cancel delivery.');
        } finally {
            setCancelLoading(false);
        }
    };

    // OTP verification handler
    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        setOtpError('');
        try {
            await verifyDeliveryOtp(delivery._id, otpInput);
            toast.success('Delivery confirmed! Thank you.');
            setOtpInput('');
            if (onCancel) onCancel(); // To refresh list
        } catch (err) {
            setOtpError(err.response?.data?.error || 'Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const isPending = delivery.status === 'Pending';
    const isAccepted = delivery.status === 'Accepted';
    const isInTransit = delivery.status === 'In-Transit';
    const isDelivered = delivery.status === 'Delivered';

    // Show cancel button for customer if Pending or Accepted
    const showCancel = !isDriverView && (isPending || isAccepted);
    // Show review button for customer if Delivered
    // const showReview = !isDriverView && isDelivered;
    // Show OTP modal for customer if delivery is In-Transit and deliveryOtp exists
    const shouldShowOtpEntry = !isDriverView && isInTransit && delivery.deliveryOtp;

    return (
        <div className={`delivery-card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 flex flex-col h-full`}
            onClick={() => navigate(`/delivery/${delivery._id}`)}
            style={{ cursor: 'pointer' }}
        >
            {/* Main Card Content */}
            <div className="flex flex-col flex-grow p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 break-words truncate max-w-full">
                        {delivery.packageName || 'Package'} #{delivery._id.substring(0, 8)}
                    </h3>
                    <StatusBadge status={delivery.status} />
                </div>
                
                {/* Image - Always visible, now triggers modal */}
                <div 
                    className="relative w-full h-48 rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={toggleDetailsModal} // Changed to toggleDetailsModal
                >
                    <img
                        src={fullPhotoUrl}
                        alt="Delivery Item"
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = defaultPlaceholder; 
                        }}
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                        {/* Always show ChevronDown for visual cue that it's expandable */}
                        <ChevronDown className="h-5 w-5 text-white" /> 
                    </div>
                </div>

                {/* Display assigned driver name AND price for customer view, below the image */}
                {!isDriverView && (
                    <div className="mb-3 space-y-1"> {/* Use space-y-1 for vertical spacing */}
                        {delivery.driver && typeof delivery.driver === 'object' && delivery.driver !== null && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="font-medium">Assigned to:</span>
                                <span className="text-sky-700 dark:text-sky-400">{delivery.driver.name || delivery.driver.username || 'N/A'}</span>
                            </div>
                        )}
                        {/* Display Price (Charge) */}
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="font-medium">Charge:</span>
                            <span className="text-gray-600 dark:text-gray-400 font-semibold">
                                ₹{delivery.priceEstimate}
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Details - Always visible (now only pickup/dropoff, distance) */}
                <div className="space-y-3 flex-grow">
                    {/* Pickup Address (truncated) */}
                    <div className="flex items-start gap-2">
                        <MapPin className="flex-shrink-0 h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Pickup</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-full">
                                {delivery.pickupAddress}
                            </p>
                        </div>
                    </div>
                    {/* Dropoff Address (truncated) */}
                    <div className="flex items-start gap-2">
                        <MapPin className="flex-shrink-0 h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Dropoff</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-full">
                                {delivery.dropoffAddress}
                            </p>
                        </div>
                    </div>
                    {/* Basic Info Row (now only distance) */}
                    <div className="flex items-center gap-1 pt-1">
                        <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {delivery.distanceInKm != null ? Number(delivery.distanceInKm).toFixed(2) : 0} km
                        </span>
                    </div>
                </div>
                {/* Spacer to push button to bottom */}
                <div className="flex-grow" />
                {/* Action Buttons for Driver View (always visible at bottom if not delivered) */}
                {isDriverView && !isDelivered && (
                    <div className="mt-4 space-y-2">
                        {isPending && onAccept && (
                            <button
                                onClick={() => onAccept(delivery._id)}
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
                                onClick={() => setShowConfirmTransitModal(true)}
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
                                onClick={() => setShowConfirmDeliveredModal(true)}
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
            </div>

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

            {/* OTP Entry Modal for Customer */}
            {shouldShowOtpEntry && (
                <OtpModal
                    show={shouldShowOtpEntry}
                    otpInput={otpInput}
                    setOtpInput={setOtpInput}
                    otpLoading={otpLoading}
                    otpError={otpError}
                    onClose={() => setOtpInput('')}
                    onSubmit={handleOtpVerify}
                />
            )}
        </div>
    );
};

export default DeliveryCard;
