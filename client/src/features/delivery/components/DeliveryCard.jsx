// src/features/delivery/components/DeliveryCard.jsx
import React, { useState } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';
import { cancelDelivery, verifyDeliveryOtp } from '../api/index';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DeliveryCardHeader from './DeliveryCardHeader';
import DeliveryCardImage from './DeliveryCardImage';
import DeliveryCardInfo from './DeliveryCardInfo';
import DeliveryCardActions from './DeliveryCardActions';
import DeliveryCardModals from './DeliveryCardModals';
import OtpModal from './OtpModal';

const DeliveryCard = ({ delivery, isDriverView = false, onAccept, onUpdateStatus, updateLoading = false, isAccepting = false, onCancel }) => {
    const [showConfirmTransitModal, setShowConfirmTransitModal] = useState(false);
    const [showConfirmDeliveredModal, setShowConfirmDeliveredModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const navigate = useNavigate();

    const defaultPlaceholder = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';
    const fullPhotoUrl = delivery.photoUrl ? (delivery.photoUrl.startsWith('http') ? delivery.photoUrl : `${API_BASE_URL}${delivery.photoUrl}`) : defaultPlaceholder;

    const toggleDetailsModal = () => setShowDetailsModal(!showDetailsModal);

    const handleConfirmTransit = () => {
        setShowConfirmTransitModal(false);
        if (onUpdateStatus) {
            onUpdateStatus(delivery._id, 'In-Transit');
        }
    };

    // Refactored: When driver clicks 'Deliver', show OTP modal
    const handleConfirmDelivered = () => {
        setShowConfirmDeliveredModal(false);
        setShowOtpModal(true); // Show OTP modal for driver
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

    // Robust OTP handler for driver
    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        setOtpError('');
        try {
            await verifyDeliveryOtp(delivery._id, otpInput);
            toast.success('Delivery confirmed! Thank you.');
            setOtpInput('');
            setShowOtpModal(false);
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

    const showCancel = !isDriverView && (isPending || isAccepted);
    const shouldShowOtpEntry = !isDriverView && isInTransit && delivery.deliveryOtp;

    return (
        <div
            className={
                `bg-white dark:bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.01] flex flex-col h-full font-sans p-5 space-y-3`
            }
            style={{ cursor: 'default' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 truncate max-w-[70%] break-words">
                    {delivery.packageName || 'Package'} #{delivery._id.substring(0, 8)}
                </h3>
                {/* Status badge (delivered/cancelled) */}
                {delivery.status === 'Delivered' && (
                    <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-white text-xs px-3 py-1 rounded-full font-semibold uppercase">
                        Delivered
                    </span>
                )}
                {delivery.status === 'Cancelled' && (
                    <span className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-white text-xs px-3 py-1 rounded-full font-semibold uppercase">
                        Cancelled
                    </span>
                )}
            </div>
            {/* Image section */}
            <div className="rounded-xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 w-full">
                <DeliveryCardImage fullPhotoUrl={fullPhotoUrl} defaultPlaceholder={defaultPlaceholder} onClick={() => navigate(`/delivery/${delivery._id}`)} />
            </div>
            {/* Info (driver, price) */}
            <div className="mb-1 space-y-1 w-full">
                {delivery.driver && typeof delivery.driver === 'object' && delivery.driver !== null && (
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-bold text-blue-700 dark:text-blue-400">Assigned to:</span>
                        <span className="text-blue-600 dark:text-blue-300 break-all max-w-full">{delivery.driver.name || delivery.driver.username || 'N/A'}</span>
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold text-blue-700 dark:text-blue-400">Charge:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold break-all max-w-full">₹{delivery.priceEstimate}</span>
                </div>
            </div>
            {/* Main Details (pickup/dropoff/distance) */}
            <div className="space-y-2 w-full">
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Pickup:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-900 break-words max-w-full flex-1">{delivery.pickupAddress}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Dropoff:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-900 break-words max-w-full flex-1">{delivery.dropoffAddress}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Distance:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-900">{delivery.distanceInKm != null ? Number(delivery.distanceInKm).toFixed(2) : 0} km</span>
                </div>
            </div>
            {/* Actions (driver/customer) */}
            <div className="pt-2">
                <DeliveryCardActions
                    isDriverView={isDriverView}
                    isDelivered={isDelivered}
                    isPending={isPending}
                    isAccepted={isAccepted}
                    isInTransit={isInTransit}
                    onAccept={onAccept}
                    onUpdateStatus={(status) => {
                        if (status === 'In-Transit') setShowConfirmTransitModal(true);
                        else if (status === 'Delivered') setShowConfirmDeliveredModal(true);
                    }}
                    updateLoading={updateLoading}
                    isAccepting={isAccepting}
                    deliveryId={delivery._id}
                    showCancel={showCancel}
                    handleCancel={handleCancel}
                    cancelLoading={cancelLoading}
                />
            </div>
            {/* Modals (confirm, details, OTP) */}
            <DeliveryCardModals
                showConfirmTransitModal={showConfirmTransitModal}
                setShowConfirmTransitModal={setShowConfirmTransitModal}
                showConfirmDeliveredModal={showConfirmDeliveredModal}
                setShowConfirmDeliveredModal={setShowConfirmDeliveredModal}
                showDetailsModal={showDetailsModal}
                toggleDetailsModal={toggleDetailsModal}
                shouldShowOtpEntry={shouldShowOtpEntry}
                otpInput={otpInput}
                setOtpInput={setOtpInput}
                otpLoading={otpLoading}
                otpError={otpError}
                handleOtpVerify={handleOtpVerify}
                updateLoading={updateLoading}
                handleConfirmTransit={handleConfirmTransit}
                handleConfirmDelivered={handleConfirmDelivered}
                delivery={delivery}
            />
            {/* OTP Modal for driver (new flow) */}
            {showOtpModal && (
                <OtpModal
                    show={showOtpModal}
                    otpInput={otpInput}
                    setOtpInput={setOtpInput}
                    otpLoading={otpLoading}
                    otpError={otpError}
                    onClose={() => { setShowOtpModal(false); setOtpInput(''); setOtpError(''); }}
                    onSubmit={handleOtpVerify}
                />
            )}
        </div>
    );
};

export default DeliveryCard;
