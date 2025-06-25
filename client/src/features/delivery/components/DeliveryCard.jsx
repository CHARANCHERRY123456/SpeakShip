// src/features/delivery/components/DeliveryCard.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';
import DeliveryService from '../api/index';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DeliveryCardHeader from './DeliveryCardHeader';
import DeliveryCardImage from './DeliveryCardImage';
import DeliveryCardInfo from './DeliveryCardInfo';
import DeliveryCardActions from './DeliveryCardActions';
import DeliveryCardModals from './DeliveryCardModals';
import OtpModal from './OtpModal';
import StatusBadge from './StatusBadge';

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

    // --- AGGRESSIVE LOGGING FOR DEBUGGING ---
    useEffect(() => {
        console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] showOtpModal state changed to:`, showOtpModal);
    }, [showOtpModal, delivery._id]);

    useEffect(() => {
        console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] showConfirmDeliveredModal state changed to:`, showConfirmDeliveredModal);
    }, [showConfirmDeliveredModal, delivery._id]);
    // --- END AGGRESSIVE LOGGING ---

    const handleConfirmTransit = () => {
        console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] handleConfirmTransit called.`);
        setShowConfirmTransitModal(false);
        if (onUpdateStatus) {
            onUpdateStatus(delivery._id, 'In-Transit');
        }
    };

    const handleConfirmDelivered = async () => {
        console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] handleConfirmDelivered called. Closing confirm modal.`);
        setShowConfirmDeliveredModal(false);
        setOtpError('');
        setOtpInput('');
        setOtpLoading(true);
        try {
            console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] Attempting to call DeliveryService.updateDeliveryStatus to trigger OTP.`);
            await DeliveryService.updateDeliveryStatus(delivery._id, 'Delivered');
            console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] OTP trigger successful. Setting showOtpModal to true.`);
            setShowOtpModal(true); // Show the dedicated full-screen OTP modal
        } catch (err) {
            console.error(`[DeliveryCard:${delivery._id.substring(0, 8)}] OTP trigger failed:`, err.response?.data?.error || err.message);
            toast.error(err.response?.data?.error || 'Failed to trigger OTP. Please try again.');
        } finally {
            setOtpLoading(false);
            console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] OTP loading set to false.`);
        }
    };

    const handleCancel = async () => {
        console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] handleCancel called.`);
        setCancelLoading(true);
        try {
            await DeliveryService.cancelDelivery(delivery._id);
            toast.success('Delivery cancelled successfully.');
            if (onCancel) onCancel(delivery._id);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to cancel delivery.');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] handleOtpVerify called with OTP: ${otpInput}`);
        setOtpLoading(true);
        setOtpError('');
        try {
            await DeliveryService.verifyDeliveryOtp(delivery._id, otpInput);
            toast.success('Delivery confirmed! Thank you.');
            setOtpInput('');
            console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] OTP verified. Setting showOtpModal to false.`);
            setShowOtpModal(false); // Close the OTP modal
            if (onUpdateStatus) {
                console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] Updating status to 'Delivered' via onUpdateStatus.`);
                onUpdateStatus(delivery._id, 'Delivered');
            }
        } catch (err) {
            console.error(`[DeliveryCard:${delivery._id.substring(0, 8)}] OTP verification failed:`, err.response?.data?.error || err.message);
            setOtpError(err.response?.data?.error || 'Invalid OTP. Please try again.');
        } finally {
            setOtpLoading(false);
            console.log(`[DeliveryCard:${delivery._id.substring(0, 8)}] OTP verification loading set to false.`);
        }
    };

    const isPending = delivery.status === 'Pending';
    const isAccepted = delivery.status === 'Accepted';
    const isInTransit = delivery.status === 'In-Transit';
    const isDelivered = delivery.status === 'Delivered';

    const showCancel = !isDriverView && (isPending || isAccepted);

    return (
        // Added 'relative' to the main card container for absolute positioning of OtpModal
        <div
            className={
                `relative bg-white dark:bg-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.01] flex flex-col h-full font-sans p-4 md:p-5 space-y-3 border border-gray-100 focus-within:ring-2 focus-within:ring-blue-300`
            }
            tabIndex={0}
            style={{ cursor: 'default', minHeight: '100%' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-1 gap-2">
                <h3 className="text-base md:text-lg font-bold text-blue-700 dark:text-blue-400 truncate max-w-[70%] break-words">
                    {delivery.packageName || 'Package'} #{delivery._id.substring(0, 8)}
                </h3>
                <StatusBadge status={delivery.status} />
            </div>
            {/* Image section */}
            <div className="rounded-xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 w-full aspect-[4/2] min-h-[120px] max-h-48 flex items-center justify-center bg-gray-50">
                <DeliveryCardImage fullPhotoUrl={fullPhotoUrl} defaultPlaceholder={defaultPlaceholder} onClick={() => navigate(`/delivery/${delivery._id}`)} />
            </div>
            {/* Info (driver, price) */}
            <div className="mb-1 space-y-1 w-full">
                {delivery.driver && typeof delivery.driver === 'object' && delivery.driver !== null && (
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                        <span className="font-bold text-blue-700 dark:text-blue-400">Assigned to:</span>
                        <span className="text-blue-600 dark:text-blue-300 break-all max-w-full">{delivery.driver.name || delivery.driver.username || 'N/A'}</span>
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <span className="font-bold text-blue-700 dark:text-blue-400">Charge:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold break-all max-w-full">₹{delivery.priceEstimate}</span>
                </div>
            </div>
            {/* Main Details (pickup/dropoff/distance) */}
            <div className="space-y-2 w-full">
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-400">Pickup:</span>
                    <span className="text-xs md:text-sm text-gray-900 dark:text-gray-900 break-words max-w-full flex-1">{delivery.pickupAddress}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-400">Dropoff:</span>
                    <span className="text-xs md:text-sm text-gray-900 dark:text-gray-900 break-words max-w-full flex-1">{delivery.dropoffAddress}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full">
                    <Truck className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-xs md:text-sm font-medium text-blue-700 dark:text-blue-400">Distance:</span>
                    <span className="text-xs md:text-sm text-gray-900 dark:text-gray-900">{delivery.distanceInKm != null ? Number(delivery.distanceInKm).toFixed(2) : 0} km</span>
                </div>
            </div>
            {/* Actions (driver/customer) */}
            <div className="flex-1 flex flex-col justify-end mt-2">
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
            {/* Modals (confirm, details) */}
            <DeliveryCardModals
                showConfirmTransitModal={showConfirmTransitModal}
                setShowConfirmTransitModal={setShowConfirmTransitModal}
                showConfirmDeliveredModal={showConfirmDeliveredModal}
                setShowConfirmDeliveredModal={setShowConfirmDeliveredModal}
                showDetailsModal={showDetailsModal}
                toggleDetailsModal={toggleDetailsModal}
                handleConfirmTransit={handleConfirmTransit}
                handleConfirmDelivered={handleConfirmDelivered}
                delivery={delivery}
                updateLoading={updateLoading}
            />
            {/* OTP Modal rendered directly inside the card */}
            {showOtpModal && (
                <OtpModal
                    data-testid={`otp-modal-${delivery._id}`}
                    show={showOtpModal}
                    otpInput={otpInput}
                    setOtpInput={setOtpInput}
                    otpLoading={otpLoading}
                    otpError={otpError}
                    onClose={() => { setShowOtpModal(false); setOtpInput(''); setOtpError(''); }}
                    onSubmit={handleOtpVerify}
                    delivery={delivery}
                />
            )}
        </div>
    );
};

export default DeliveryCard;