import React from 'react';
import { motion } from 'framer-motion';
import { Check, DollarSign, MapPin, Package } from 'lucide-react';

const ReviewStep = ({ formData, calculateDeliveryTimeEstimate }) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Customer Details</h4>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Name:</span> {formData.name}</p>
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Email:</span> {formData.email}</p>
            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Phone:</span> {formData.phone}</p>
          </div>
        </motion.div>
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Package Details</h4>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Item:</span> {formData.packageName}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Priority:</span> {formData.priorityLevel}
            </p>
            <div className="flex items-center mt-3">
              <img src={formData.photoPreviewUrl || 'https://placehold.co/100x100?text=No+Image'} alt="Package" className="w-12 h-12 rounded-lg object-cover" />
            </div>
          </div>
        </motion.div>
      </div>
      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Pickup Location</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{formData.pickupAddress}</p>
          {formData.note && (
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Instructions:</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{formData.note}</p>
            </div>
          )}
        </motion.div>
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-3">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white">Delivery Location</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{formData.dropoffAddress}</p>
        </motion.div>
      </div>
      {/* Final Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800 mt-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            Total Estimate:
            <span className="text-blue-600 dark:text-blue-400">₹{formData.priceEstimate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            Est. Delivery Time:
            <span className="font-semibold text-gray-900 dark:text-white">
              {formData.deliveryTimeEstimate ? new Date(formData.deliveryTimeEstimate).toLocaleString() : 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export default ReviewStep;
