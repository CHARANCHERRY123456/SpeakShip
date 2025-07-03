import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import MapAddressPicker from './MapAddressPicker';
import AddressAutocompleteInput from './AddressAutocompleteInput';

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
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
        Pickup & Drop-off Locations
      </h3>
      <p className="text-gray-600 dark:text-gray-600">
        Select pickup and drop-off addresses using the map below.
      </p>
    </div>
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-50 dark:to-emerald-50 rounded-2xl p-4 md:p-8">
      {/* Address Autocomplete Inputs */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressAutocompleteInput
          label="Pickup Address"
          value={formData.pickupAddress}
          onChange={e => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
          onSelectSuggestion={suggestion => {
            if (suggestion.lat && suggestion.lon) {
              setPickupPosition({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
            }
          }}
          placeholder="Search or type pickup address"
          required
          icon={MapPin}
        />
        <AddressAutocompleteInput
          label="Drop-off Address"
          value={formData.dropoffAddress}
          onChange={e => setFormData(prev => ({ ...prev, dropoffAddress: e.target.value }))}
          onSelectSuggestion={suggestion => {
            if (suggestion.lat && suggestion.lon) {
              setDropoffPosition({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
            }
          }}
          placeholder="Search or type drop-off address"
          required
          icon={MapPin}
        />
      </div>
      {/* Map picker remains for visual/manual selection */}
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
    </div>
  </motion.div>
);

export default PickupDropoffStep;
