import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Notebook, Camera, 
  Truck, User, Calendar, CheckCircle, 
  Tag, PackageCheck, TruckIcon, ChevronDown, ChevronUp 
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
    <div className={`delivery-card ${isExpanded ? 'max-h-[1000px]' : 'max-h-96'}`}>
      {/* Compact Header with Image */}
      <div className="p-4">
        <div className="card-header">
          <h3 className="card-title">
            {delivery.packageName || 'Package'} #{delivery._id.substring(0, 8)}
          </h3>
          <StatusBadge status={delivery.status} />
        </div>
        
        {/* Image in main card */}
        <div className="card-image-container" onClick={toggleExpand}>
          <img
            src={fullPhotoUrl || 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'}
            alt="Delivery Item"
            className="card-image"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'; 
            }}
          />
        </div>
        
        {/* Basic Info Preview */}
        <div className="space-y-2">
          <div className="address-preview">
            <MapPin className="address-icon" />
            <div>
              <p className="font-medium">Pickup:</p>
              <p className="truncate">{delivery.pickupAddress}</p>
            </div>
          </div>
          <div className="address-preview">
            <MapPin className="address-icon" />
            <div>
              <p className="font-medium">Dropoff:</p>
              <p className="truncate">{delivery.dropoffAddress}</p>
            </div>
          </div>
          {delivery.priorityLevel && (
            <div className="address-preview">
              <Tag className="address-icon" />
              <div>
                <p className="font-medium">Priority:</p>
                <p className="capitalize">{delivery.priorityLevel.toLowerCase()}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Expand button */}
        <button 
          onClick={toggleExpand}
          className="expand-button"
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

      {/* Expanded Content (without repeating the image) */}
      {isExpanded && (
        <div className="expanded-content px-4 pb-4">
          {/* Customer Details */}
          <div className="section">
            <h4 className="section-title">
              <User className="section-icon" /> Customer Details
            </h4>
            <div className="space-y-2">
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
          <div className="section">
            <h4 className="section-title">
              <MapPin className="section-icon" /> Address Details
            </h4>
            <div className="space-y-3">
              <div>
                <p className="info-label">Pickup Address</p>
                <p className="info-value">{delivery.pickupAddress}</p>
              </div>
              <div>
                <p className="info-label">Dropoff Address</p>
                <p className="info-value">{delivery.dropoffAddress}</p>
              </div>
              {delivery.note && (
                <div className="flex items-start gap-2 mt-3">
                  <Notebook className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" /> 
                  <div>
                    <p className="info-label">Special Note</p>
                    <p className="info-value">{delivery.note}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="section">
            <h4 className="section-title">
              <Truck className="section-icon" /> Delivery Information
            </h4>
            <div className="delivery-info-grid">
              <div className="info-item">
                <p className="info-label">Distance</p>
                <p className="info-value">{delivery.distanceInKm} km</p>
              </div>
              <div className="info-item">
                <p className="info-label">Price Estimate</p>
                <p className="info-value">₹{delivery.priceEstimate}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Priority</p>
                <p className="info-value capitalize">{delivery.priorityLevel.toLowerCase()}</p>
              </div>
              <div className="info-item">
                <p className="info-label">Estimated Time</p>
                <p className="info-value">
                  {delivery.deliveryTimeEstimate ? 
                    new Date(delivery.deliveryTimeEstimate).toLocaleString() : 
                    'Not estimated'}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Details */}
          {delivery.driver && typeof delivery.driver === 'object' && (
            <div className="section">
              <h4 className="section-title">
                <Truck className="section-icon" /> Assigned Driver
              </h4>
              <div className="space-y-2">
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
          <div className="timestamps">
            <p className="timestamp">
              <Calendar className="h-3 w-3" /> 
              Created: {new Date(delivery.createdAt).toLocaleString()}
            </p>
            <p className="timestamp">
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
                  className="action-button accept-button"
                >
                  <CheckCircle className="h-5 w-5" /> Accept This Delivery
                </button>
              )}

              {isAccepted && onUpdateStatus && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={updateLoading}
                  className={`action-button in-transit-button ${updateLoading ? 'disabled-button' : ''}`}
                >
                  {updateLoading ? (
                    <>
                      <svg className="spinner h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  className={`action-button delivered-button ${updateLoading ? 'disabled-button' : ''}`}
                >
                  {updateLoading ? (
                    <>
                      <svg className="spinner h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Parcel Pickup</h3>
            <p className="modal-message">Have you physically picked up the parcel for this delivery?</p>
            <div className="modal-actions">
              <button
                onClick={handleProceedInTransit}
                className="modal-button modal-confirm"
              >
                Yes, Picked Up
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="modal-button modal-cancel"
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