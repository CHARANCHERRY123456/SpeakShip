import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Notebook, Camera, 
  Truck, User, Calendar, CheckCircle, 
  Tag, PackageCheck, Truck as TruckIcon, ChevronDown, ChevronUp 
} from 'lucide-react';
import { API_BASE_URL } from '../../../constants/config';
import './DeliveryCard.css'; // Import the CSS file

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
    <div className={`delivery-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
      isExpanded ? 'max-h-[2000px]' : 'max-h-96'
    }`}>
      {/* Compact Header */}
      <div className="p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {delivery.packageName || 'Package'} #{delivery._id.substring(0, 8)}
          </h3>
          <StatusBadge status={delivery.status} />
        </div>
        
        {/* Image */}
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
        </div>
        
        {/* Basic Info Preview */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Pickup:</p>
              <p className="text-sm text-gray-600 truncate">{delivery.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">Dropoff:</p>
              <p className="text-sm text-gray-600 truncate">{delivery.dropoffAddress}</p>
            </div>
          </div>
          {delivery.priorityLevel && (
            <div className="flex items-start gap-3">
              <Tag className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">Priority:</p>
                <p className="text-sm text-gray-600 capitalize">{delivery.priorityLevel.toLowerCase()}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Expand button */}
        <button 
          onClick={toggleExpand}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show More Details
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 md:px-5 md:pb-5">
          {/* Customer Details */}
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
              <User className="h-5 w-5 text-gray-600" /> Customer Details
            </h4>
            <div className="space-y-2 pl-7">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" /> {delivery.customer?.name || delivery.name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" /> {delivery.customer?.email || delivery.email}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" /> {delivery.customer?.phone || delivery.phone}
              </p>
            </div>
          </div>

          {/* Full Address Details */}
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" /> Address Details
            </h4>
            <div className="space-y-3 pl-7">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Pickup Address</p>
                <p className="text-sm text-gray-600">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Dropoff Address</p>
                <p className="text-sm text-gray-600">{delivery.dropoffAddress}</p>
              </div>
              {delivery.note && (
                <div className="flex items-start gap-2 pt-2">
                  <Notebook className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" /> 
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Special Note</p>
                    <p className="text-sm text-gray-600">{delivery.note}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
              <Truck className="h-5 w-5 text-gray-600" /> Delivery Information
            </h4>
            <div className="grid grid-cols-2 gap-3 pl-7">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Distance</p>
                <p className="text-sm text-gray-600">{delivery.distanceInKm} km</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Price Estimate</p>
                <p className="text-sm text-gray-600">₹{delivery.priceEstimate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Priority</p>
                <p className="text-sm text-gray-600 capitalize">{delivery.priorityLevel.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Est. Time</p>
                <p className="text-sm text-gray-600">
                  {delivery.deliveryTimeEstimate ? 
                    new Date(delivery.deliveryTimeEstimate).toLocaleString() : 
                    'Not estimated'}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          {delivery.driver && typeof delivery.driver === 'object' && (
            <div className="mb-6">
              <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-3">
                <Truck className="h-5 w-5 text-gray-600" /> Assigned Driver
              </h4>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" /> 
                  {delivery.driver.name || delivery.driver.username || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" /> 
                  {delivery.driver.phone || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" /> 
                  Accepted at: {delivery.acceptedAt ? new Date(delivery.acceptedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
            <p className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> 
              Created: {new Date(delivery.createdAt).toLocaleString()}
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> 
              Updated: {new Date(delivery.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          {isDriverView && (
            <div className="mt-6 space-y-3">
              {isPending && onAccept && (
                <button
                  onClick={() => onAccept(delivery._id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <CheckCircle className="h-5 w-5" /> Accept This Delivery
                </button>
              )}

              {isAccepted && onUpdateStatus && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={updateLoading}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    updateLoading 
                      ? 'bg-purple-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
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

              {isInTransit && onUpdateStatus && (
                <button
                  onClick={() => onUpdateStatus(delivery._id, 'Delivered')}
                  disabled={updateLoading}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    updateLoading 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
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
            </div>
          )}
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
                className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Yes, Picked Up
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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