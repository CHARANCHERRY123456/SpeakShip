import React from 'react';
import { motion } from 'framer-motion';
import { Check, DollarSign, MapPin, Package } from 'lucide-react';

const ReviewStep = ({ formData }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Review Your Order
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Please review all details before confirming
      </p>
    </div>
    <div className="space-y-6">
      {/* Customer & Package Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center mb-3 md:mb-4">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-2 md:mr-3">
              <Package className="w-5 h-5 text-blue-600" />
            </span>
            <h4 className="font-bold text-base md:text-lg text-blue-900">Customer Details</h4>
          </div>
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
            <p className="text-blue-900 break-words"><span className="font-medium">Name:</span> {formData.name}</p>
            <p className="text-blue-900 break-words"><span className="font-medium">Email:</span> {formData.email}</p>
            <p className="text-blue-900 break-words"><span className="font-medium">Phone:</span> {formData.phone}</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center mb-3 md:mb-4">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center mr-2 md:mr-3">
              <Package className="w-5 h-5 text-green-600" />
            </span>
            <h4 className="font-bold text-base md:text-lg text-green-900">Package Details</h4>
          </div>
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
            <p className="text-green-900 break-words">
              <span className="font-medium">Item:</span> {formData.packageName}</p>
            <p className="text-green-900 break-words">
              <span className="font-medium">Priority:</span> {formData.priorityLevel}</p>
            <div className="flex items-center mt-2 md:mt-3">
              <img src={formData.photoPreviewUrl || 'https://placehold.co/100x100?text=No+Image'} alt="Package" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center mb-3 md:mb-4">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-2 md:mr-3">
              <MapPin className="w-5 h-5 text-purple-600" />
            </span>
            <h4 className="font-bold text-base md:text-lg text-purple-900">Pickup Location</h4>
          </div>
          <p className="text-purple-900 text-xs md:text-sm mb-2 md:mb-3 break-words">{formData.pickupAddress}</p>
          {formData.note && (
            <div className="bg-white/60 p-2 md:p-3 rounded-lg">
              <p className="text-xs font-medium text-purple-700 mb-1">Instructions:</p>
              <p className="text-xs md:text-sm text-purple-900 break-words">{formData.note}</p>
            </div>
          )}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-6">
          <div className="flex items-center mb-3 md:mb-4">
            <span className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-2 md:mr-3">
              <MapPin className="w-5 h-5 text-orange-600" />
            </span>
            <h4 className="font-bold text-base md:text-lg text-orange-900">Delivery Location</h4>
          </div>
          <p className="text-orange-900 text-xs md:text-sm break-words">{formData.dropoffAddress}</p>
        </div>
      </div>
      {/* Final Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mt-6 md:mt-8 shadow-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-green-500" />
          <span className="text-lg font-bold text-gray-900">Order Summary</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center gap-1">
            <Package className="w-4 h-4" /> {formData.packageName}
          </span>
          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center gap-1">
            {formData.distanceInKm ? `${formData.distanceInKm.toFixed(1)} km` : '0.0 km'}
          </span>
          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center gap-1">
            {formData.priorityLevel}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-base text-gray-600">Total Amount</div>
          <div className="text-3xl font-extrabold text-green-600">₹{formData.priceEstimate}</div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Estimated delivery: {formData.deliveryTimeEstimate ? new Date(formData.deliveryTimeEstimate).toLocaleString() : 'N/A'}
        </div>
      </div>
    </div>
  </motion.div>
);

export default ReviewStep;
