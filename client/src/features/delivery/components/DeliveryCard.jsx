import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Notebook, Camera, 
  Truck, User, Calendar, CheckCircle, 
  Tag, PackageCheck, Truck as TruckIcon, ChevronDown, ChevronUp 
} from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';
import './DeliveryCard.css';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'In-Transit': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'default': 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
      statusStyles[status] || statusStyles.default
    }`}>
      {status}
    </span>
  );
};

const DeliveryCard = ({ delivery, isDriverView = false, onAccept, onUpdateStatus, updateLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fullPhotoUrl = delivery.photoUrl ? `${API_BASE_URL}${delivery.photoUrl}` : '';

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleProceedInTransit = () => {
    setShowConfirmModal(false);
    if (onUpdateStatus) {
      onUpdateStatus(delivery._id, 'In-Transit');
    }
  };

  // Determine status for action buttons
  const isPending = delivery.status === 'Pending';
  const isAccepted = delivery.status === 'Accepted';
  const isInTransit = delivery.status === 'In-Transit';

  return (
    <div className={
      `delivery-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 flex flex-col h-full min-h-[420px]`
    }>
      {/* Main Card Content */}
      <div className="flex flex-col flex-grow p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 break-words truncate max-w-full">
            {delivery.packageName || 'Package'} #{delivery._id.substring(0, 8)}
          </h3>
          <StatusBadge status={delivery.status} />
        </div>
        {/* Image - Always visible */}
        <div 
          className="relative w-full h-48 rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={toggleExpand}
        >
          <img
            src={fullPhotoUrl || 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'}
            alt="Delivery Item"
            className="w-full h-full object-cover"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'; 
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-white" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
        {/* Main Details - Always visible */}
        <div className="space-y-3 flex-grow">
          {/* Pickup Address (truncated) */}
          <div className="flex items-start gap-2">
            <MapPin className="flex-shrink-0 h-4 w-4 text-green-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700">Pickup</p>
              <p className="text-sm text-gray-600 truncate max-w-full">
                {delivery.pickupAddress}
              </p>
            </div>
          </div>
          {/* Dropoff Address (truncated) */}
          <div className="flex items-start gap-2">
            <MapPin className="flex-shrink-0 h-4 w-4 text-red-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700">Dropoff</p>
              <p className="text-sm text-gray-600 truncate max-w-full">
                {delivery.dropoffAddress}
              </p>
            </div>
          </div>
          {/* Basic Info Row */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {delivery.distanceInKm != null ? Number(delivery.distanceInKm).toFixed(2) : 0} km
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 font-semibold">
                ₹{delivery.priceEstimate}
              </span>
            </div>
          </div>
        </div>
        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />
        {/* Action Buttons for Driver View (always visible) */}
        {isDriverView && (
          <div className="mt-4 space-y-2">
            {isPending && onAccept && (
              <button
                onClick={() => onAccept(delivery._id)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Accept
              </button>
            )}
            {isAccepted && onUpdateStatus && (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={updateLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors ${
                  updateLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {updateLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    In-Transit
                  </>
                ) : (
                  <>
                    <TruckIcon className="h-4 w-4" /> In-Transit
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content - Additional Details */}
      {isExpanded && (
        <div className="px-4 pb-4 md:px-6 md:pb-6 border-t border-gray-100 bg-gray-50">
          <div className="pt-4 space-y-4">
            
            {/* Customer Details */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                <User className="h-4 w-4 text-gray-600" /> Customer Details
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="flex-shrink-0 h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-700">Name</p>
                    <p className="text-gray-600">{delivery.customer?.name || delivery.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="flex-shrink-0 h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-600 break-all">{delivery.customer?.email || delivery.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="flex-shrink-0 h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">{delivery.customer?.phone || delivery.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Address Details */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <MapPin className="h-4 w-4 text-green-600" /> Full Pickup Address
                </h4>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600 break-words">{delivery.pickupAddress}</p>
                </div>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <MapPin className="h-4 w-4 text-red-600" /> Full Dropoff Address
                </h4>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600 break-words">{delivery.dropoffAddress}</p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                <Truck className="h-4 w-4 text-gray-600" /> Delivery Information
              </h4>
              <div className="bg-white rounded-lg p-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Distance</p>
                  <p className="text-gray-600">{delivery.distanceInKm} km</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Price</p>
                  <p className="text-gray-600">₹{delivery.priceEstimate}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Priority</p>
                  <p className={`capitalize ${
                    delivery.priorityLevel?.toLowerCase() === 'high' ? 'text-red-600' :
                    delivery.priorityLevel?.toLowerCase() === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {delivery.priorityLevel?.toLowerCase() || 'normal'}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Est. Delivery Time</p>
                  <p className="text-gray-600">
                    {delivery.deliveryTimeEstimate ? 
                      new Date(delivery.deliveryTimeEstimate).toLocaleString() : 
                      'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Note */}
            {delivery.note && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                  <Notebook className="h-4 w-4 text-gray-600" /> Special Note
                </h4>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600 break-words">{delivery.note}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" /> Timeline
              </h4>
              <div className="bg-white rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Created</p>
                  <p className="text-gray-600">{new Date(delivery.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Last Updated</p>
                  <p className="text-gray-600">{new Date(delivery.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Confirm Parcel Pickup</h3>
            <p className="text-sm text-gray-600 mb-6">Have you physically picked up the parcel for this delivery?</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleProceedInTransit}
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-white transition-colors"
              >
                Yes, Picked Up
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors"
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