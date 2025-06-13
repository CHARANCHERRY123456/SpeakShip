// src/features/delivery/components/DeliveryCard.jsx
import React, { useState } from 'react'; // Import useState
import { MapPin, Mail, Phone, Notebook, Camera, Truck, User, Calendar, CheckCircle, Tag, PackageCheck, TruckIcon } from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';

const DeliveryCard = ({ delivery, isDriverView = false, onAccept, onUpdateStatus, updateLoading = false }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for modal visibility

    // Determine the current status flags
    const isPending = delivery.status === 'Pending';
    const isAccepted = delivery.status === 'Accepted';
    const isInTransit = delivery.status === 'In-Transit';
    const isDelivered = delivery.status === 'Delivered'; // Renamed from isCompleted

    // --- DEBUGGING LOGS (CRITICAL FOR THIS ISSUE) ---
    React.useEffect(() => {
        console.groupCollapsed(`DeliveryCard Render Check for ID: ${delivery._id.substring(0, 8)}...`);
        console.log(`  Current Status: "${delivery.status}"`);
        console.log(`  isDriverView (prop): ${isDriverView}`);
        console.log(`  isPending (calculated in card): ${isPending}`); // Confirm this value
        console.log(`  isAccepted (calculated in card): ${isAccepted}`);
        console.log(`  isInTransit (calculated in card): ${isInTransit}`);
        console.log(`  isDelivered (calculated in card): ${isDelivered}`);
        console.log(`  onAccept prop provided: ${!!onAccept}`); // Should be true for pending
        console.log(`  onUpdateStatus prop provided: ${!!onUpdateStatus}`); // Should be true for accepted/in-transit
        console.log(`  --- Conditions for Accept Button ---`);
        console.log(`  Condition 1: isDriverView && isPending && onAccept`);
        console.log(`  Value: ${isDriverView} && ${isPending} && ${!!onAccept} = ${isDriverView && isPending && !!onAccept}`);
        console.groupEnd();
    }, [delivery, isDriverView, isPending, isAccepted, isInTransit, isDelivered, onAccept, onUpdateStatus]);
    // --- END DEBUGGING LOGS ---

    // Safely get customer display information, falling back to delivery object's fields
    const customerDisplayName = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.name : delivery.name;
    const customerDisplayEmail = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.email : delivery.email;
    const customerDisplayPhone = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.phone : delivery.phone;

    // Construct the full image URL using the base API URL
    const fullPhotoUrl = delivery.photoUrl ? `${API_BASE_URL}${delivery.photoUrl}` : '';

    const handleConfirmInTransit = () => {
        setShowConfirmModal(true); // Show the confirmation modal
    };

    const handleProceedInTransit = () => {
        setShowConfirmModal(false); // Hide modal
        if (onUpdateStatus) {
            onUpdateStatus(delivery._id, 'In-Transit'); // Proceed with status update
        }
    };

    const handleCancelInTransit = () => {
        setShowConfirmModal(false); // Hide modal
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">Delivery ID: <span className="text-sky-700 text-lg">{delivery._id.substring(0, 8)}...</span></h3>
                {/* Status Badge: Updated to include 'In-Transit' color */}
                <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                    isPending ? 'bg-yellow-100 text-yellow-800' :
                    isAccepted ? 'bg-blue-100 text-blue-800' :
                    isInTransit ? 'bg-purple-100 text-purple-800' : // New color for In-Transit
                    isDelivered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {delivery.status}
                </span>
            </div>

            {/* Customer Details Section */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2"><User className="h-4 w-4" /> Customer Details</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Tag className="h-4 w-4 text-gray-500" /> {customerDisplayName}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /> {customerDisplayEmail}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> {customerDisplayPhone}</p>
            </div>

            {/* Delivery Details Section */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" /> Addresses</h4>
                <p className="text-sm text-gray-600 mb-1 pl-6"><strong>Pickup:</strong> {delivery.pickupAddress}</p>
                <p className="text-sm text-gray-600 pl-6"><strong>Dropoff:</strong> {delivery.dropoffAddress}</p>
                {delivery.note && (
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-2"><Notebook className="h-4 w-4 text-gray-500" /> <strong>Note:</strong> {delivery.note}</p>
                )}
                {fullPhotoUrl && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><Camera className="h-4 w-4" /> Item Photo:</h4>
                        <img
                            src={fullPhotoUrl}
                            alt="Delivery Item"
                            className="w-full max-h-48 object-cover rounded-md border border-gray-300"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/cccccc/000000?text=No+Image'; }} // Fallback
                        />
                    </div>
                )}
            </div>

            {/* Driver Details (if assigned and populated) */}
            {delivery.driver && (typeof delivery.driver === 'object' && delivery.driver !== null) && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2"><Truck className="h-4 w-4" /> Assigned Driver</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /> {delivery.driver.name || delivery.driver.username || 'N/A'}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> {delivery.driver.phone || 'N/A'}</p>
                </div>
            )}

            {/* Timestamps Section */}
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Created: {new Date(delivery.createdAt).toLocaleString()}</p>
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Updated: {new Date(delivery.updatedAt).toLocaleString()}</p>
            </div>

            {/* Action Buttons for Drivers (conditional rendering) */}
            {isDriverView && ( // Only show action buttons if it's the driver's view
                <>
                    {/* Button to Accept (only visible if Pending AND onAccept handler is provided) */}
                    {isPending && onAccept && (
                        <button
                            onClick={() => onAccept(delivery._id)}
                            className="mt-6 w-full py-2.5 px-4 rounded-lg bg-green-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                        >
                            <CheckCircle className="h-5 w-5" /> Accept This Delivery
                        </button>
                    )}
                    {/* Button to Mark as In-Transit (only visible if Accepted AND onUpdateStatus handler is provided) */}
                    {isAccepted && onUpdateStatus && (
                        <button
                            onClick={handleConfirmInTransit} // Call the confirmation handler
                            disabled={updateLoading} // Disable during update
                            className={`mt-6 w-full py-2.5 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
                                updateLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                        >
                            {updateLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <TruckIcon className="h-5 w-5" /> Mark as In-Transit
                                </>
                            )}
                        </button>
                    )}
                    {/* Button to Mark as Delivered (only visible if In-Transit AND onUpdateStatus handler is provided) */}
                    {isInTransit && onUpdateStatus && (
                        <button
                            onClick={() => onUpdateStatus(delivery._id, 'Delivered')} // Call with 'Delivered' status
                            disabled={updateLoading} // Disable during update
                            className={`mt-6 w-full py-2.5 px-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors ${
                                updateLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {updateLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Marking...
                                </>
                            ) : (
                                <>
                                    <PackageCheck className="h-5 w-5" /> Mark as Delivered
                                </>
                            )}
                        </button>
                    )}
                </>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Parcel Pickup</h3>
                        <p className="text-gray-700 mb-6">Have you physically picked up the parcel for this delivery?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleProceedInTransit}
                                className="px-5 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors"
                            >
                                Yes, Picked Up
                            </button>
                            <button
                                onClick={handleCancelInTransit}
                                className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryCard;
