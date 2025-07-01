import React from 'react';
import { X, Camera, User, Mail, Phone, Truck, MapPin, Notebook, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../../../../../constants/config';

const DeliveryDetailsModal = ({ delivery, onClose }) => {
    const customerDisplayName = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.name : delivery.name;
    const customerDisplayEmail = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.email : delivery.email;
    const customerDisplayPhone = (typeof delivery.customer === 'object' && delivery.customer !== null) ? delivery.customer.phone : delivery.phone;
    const defaultPlaceholder = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';
    const fullPhotoUrl = delivery.photoUrl ? (delivery.photoUrl.startsWith('http') ? delivery.photoUrl : `${API_BASE_URL}${delivery.photoUrl}`) : defaultPlaceholder;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white dark:white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-100 text-gray-600 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-6 text-center">
                        Delivery Details for #{delivery._id.substring(0, 8)}
                    </h3>
                    <div className="space-y-6">
                        {/* Package Photo */}
                        <div className="mb-4">
                            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                <Camera className="h-5 w-5 text-gray-600 dark:text-gray-600" /> Package Photo
                            </h4>
                            <img
                                src={fullPhotoUrl}
                                alt="Delivery Item"
                                className="w-full h-auto max-h-60 object-cover rounded-lg border border-gray-200 dark:border-gray-200"
                                onError={e => { e.target.onerror = null; e.target.src = defaultPlaceholder; }}
                            />
                        </div>
                        {/* Customer Details */}
                        <div>
                            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                <User className="h-5 w-5 text-gray-600 dark:text-gray-600" /> Customer Details
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <User className="flex-shrink-0 h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-700">Name</p>
                                        <p className="text-gray-600 dark:text-gray-600">{customerDisplayName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="flex-shrink-0 h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-700">Email</p>
                                        <p className="text-gray-600 dark:text-gray-600 break-all">{customerDisplayEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="flex-shrink-0 h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-700">Phone</p>
                                        <p className="text-gray-600 dark:text-gray-600">{customerDisplayPhone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Driver Details (if assigned) */}
                        {delivery.driver && (typeof delivery.driver === 'object' && delivery.driver !== null) && (
                            <div>
                                <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                    <Truck className="h-5 w-5 text-gray-600 dark:text-gray-600" /> Assigned Driver Details
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <User className="flex-shrink-0 h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-700">Name</p>
                                            <p className="text-gray-600 dark:text-gray-600">{delivery.driver.name || delivery.driver.username || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="flex-shrink-0 h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-700">Email</p>
                                            <p className="text-gray-600 dark:text-gray-600 break-all">{delivery.driver.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="flex-shrink-0 h-4 w-4 text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-700">Phone</p>
                                            <p className="text-gray-600 dark:text-gray-600">{delivery.driver.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Full Address Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                    <MapPin className="h-5 w-5 text-green-600" /> Full Pickup Address
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-600 break-words">{delivery.pickupAddress}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                    <MapPin className="h-5 w-5 text-red-600" /> Full Dropoff Address
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-600 break-words">{delivery.dropoffAddress}</p>
                                </div>
                            </div>
                        </div>
                        {/* Delivery Information */}
                        <div>
                            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                <Truck className="h-5 w-5 text-gray-600 dark:text-gray-600" /> Delivery Information
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-700">Distance</p>
                                    <p className="text-gray-600 dark:text-gray-600">{delivery.distanceInKm} km</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-700">Price</p>
                                    <p className="text-gray-600 dark:text-gray-600">₹{delivery.priceEstimate}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-700">Priority</p>
                                    <p className={`capitalize ${
                                        delivery.priorityLevel?.toLowerCase() === 'high' ? 'text-red-600' :
                                        delivery.priorityLevel?.toLowerCase() === 'urgent' ? 'text-orange-600' : 
                                        'text-green-600'
                                    }`}>
                                        {delivery.priorityLevel?.toLowerCase() || 'normal'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-700">Est. Delivery Time</p>
                                    <p className="text-gray-600 dark:text-gray-600">
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
                                <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                    <Notebook className="h-5 w-5 text-gray-600 dark:text-gray-600" /> Special Note
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-600 break-words">{delivery.note}</p>
                                </div>
                            </div>
                        )}
                        {/* Timestamps */}
                        <div>
                            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-800 mb-2">
                                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-600" /> Timeline
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-700">Created</p>
                                    <p className="text-gray-600 dark:text-gray-600">{new Date(delivery.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-700">Last Updated</p>
                                    <p className="text-gray-600 dark:text-gray-600">{new Date(delivery.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDetailsModal;
