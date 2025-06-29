import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package } from 'lucide-react';
import MapAddressPicker from './MapAddressPicker';

const PickupDropoffStep = ({
  pickupPosition,
  setPickupPosition,
  dropoffPosition,
  setDropoffPosition,
  formData,
  setFormData,
  handleChange,
  EnhancedInput
}) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Pickup & Drop-off Locations
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Select pickup and drop-off addresses using the map below.
      </p>
    </div>
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 md:p-8">
      <MapAddressPicker
        pickupPosition={pickupPosition}
        setPickupPosition={setPickupPosition}
        dropoffPosition={dropoffPosition}
        setDropoffPosition={setDropoffPosition}
        pickupAddress={formData.pickupAddress}
        setPickupAddress={address => {
          setFormData(prev => ({ ...prev, pickupAddress: address }));
        }}
        dropoffAddress={formData.dropoffAddress}
        setDropoffAddress={address => {
          setFormData(prev => ({ ...prev, dropoffAddress: address }));
        }}
      />
      <div className="mt-6">
        <EnhancedInput
          label="Package Name"
          name="packageName"
          value={formData.packageName}
          onChange={handleChange}
          placeholder="What are you sending?"
          required
          icon={Package}
        />
      </div>
    </div>
  </motion.div>
);

export default PickupDropoffStep;
