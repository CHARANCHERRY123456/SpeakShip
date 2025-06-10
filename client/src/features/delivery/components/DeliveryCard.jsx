// src/features/delivery/components/DeliveryCard.jsx
import React from 'react';
import { MapPin, Mail, Phone, Notebook, Camera, Truck, User, Calendar, CheckCircle, Tag } from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config'; // Import API_BASE_URL

const DeliveryCard = ({ delivery, isDriverView = false, onAccept }) => {
    const isPending = delivery.status === 'Pending';
    const isAccepted = delivery.status === 'Accepted';
    const isCompleted = delivery.status === 'Completed';

    // Determine customer display info: if delivery.customer is populated, use its properties.
    // Otherwise, use the direct fields from the delivery request (which are typically copied from customer details at creation).
    // The typeof check ensures we're dealing with an object before trying to access its properties like 'name'.
    const customerDisplayName = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.name : delivery.name;
    const customerDisplayEmail = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.email : delivery.email;
    const customerDisplayPhone = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.phone : delivery.phone;

    // Construct the full image URL
    const fullPhotoUrl = delivery.photoUrl ? `${API_BASE_URL}${delivery.photoUrl}` : '';

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">Delivery ID: <span className="text-sky-700 text-lg">{delivery._id.substring(0, 8)}...</span></h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                    isPending ? 'bg-yellow-100 text-yellow-800' :
                    isAccepted ? 'bg-blue-100 text-blue-800' :
                    isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {delivery.status}
                </span>
            </div>

            {/* Customer Details */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2"><User className="h-4 w-4" /> Customer Details</h4>
                {/* Use the derived display values */}
                <p className="text-sm text-gray-600 flex items-center gap-2"><Tag className="h-4 w-4 text-gray-500" /> {customerDisplayName}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /> {customerDisplayEmail}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> {customerDisplayPhone}</p>
            </div>

            {/* Delivery Details */}
            <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2"><MapPin className="h-4 w-4" /> Addresses</h4>
                <p className="text-sm text-gray-600 mb-1 pl-6"><strong>Pickup:</strong> {delivery.pickupAddress}</p>
                <p className="text-sm text-gray-600 pl-6"><strong>Dropoff:</strong> {delivery.dropoffAddress}</p>
                {delivery.note && (
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-2"><Notebook className="h-4 w-4 text-gray-500" /> <strong>Note:</strong> {delivery.note}</p>
                )}
                {/* Display photo only if fullPhotoUrl exists */}
                {fullPhotoUrl && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1"><Camera className="h-4 w-4" /> Item Photo:</h4>
                        <img
                            src={fullPhotoUrl} // Use the constructed full URL
                            alt="Delivery Item"
                            className="w-full max-h-48 object-cover rounded-md border border-gray-300"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/cccccc/000000?text=No+Image'; }} // Fallback
                        />
                    </div>
                )}
            </div>

            {/* Driver Details (if assigned) */}
            {/* Check if driver exists and is an object before trying to access its properties */}
            {delivery.driver && (typeof delivery.driver === 'object' && delivery.driver !== null) && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="text-md font-semibold text-gray-700 flex items-center gap-2 mb-2"><Truck className="h-4 w-4" /> Assigned Driver</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><User className="h-4 w-4 text-gray-500" /> {delivery.driver.name || delivery.driver.username || 'N/A'}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" /> {delivery.driver.phone || 'N/A'}</p>
                </div>
            )}

            {/* Timestamps */}
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Created: {new Date(delivery.createdAt).toLocaleString()}</p>
                <p className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Updated: {new Date(delivery.updatedAt).toLocaleString()}</p>
            </div>

            {/* Action Button for Drivers */}
            {isDriverView && isPending && onAccept && (
                <button
                    onClick={() => onAccept(delivery._id)}
                    className="mt-6 w-full py-2.5 px-4 rounded-lg bg-green-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                >
                    <CheckCircle className="h-5 w-5" /> Accept This Delivery
                </button>
            )}
        </div>
    );
};

export default DeliveryCard;
