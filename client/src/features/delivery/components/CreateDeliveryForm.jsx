import React, { useState } from 'react';
import { MapPin, Package, Clock, DollarSign, Upload, X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../api/axios.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { STATUS_OPTIONS, DELIVERY_API_ROUTES } from '../constants';


const CreateDeliveryForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    packageName: '',
    pickupAddress: '',
    dropoffAddress: '',
    note: '',
    photoUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg',
    priorityLevel: 'Normal',
    deliveryTimeEstimate: null,
    priceEstimate: 0,
    distanceInKm: 0
  });

  const steps = [
    { number: 1, title: 'Customer & Package Details', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { number: 2, title: 'Pickup Information', icon: MapPin, color: 'from-green-500 to-emerald-500' },
    { number: 3, title: 'Delivery Information', icon: MapPin, color: 'from-purple-500 to-pink-500' },
    { number: 4, title: 'Review & Confirm', icon: Check, color: 'from-orange-500 to-red-500' }
  ];

  // Helper functions
  const handleLocationSearch = async (address, type) => {
    const mockDistance = Math.random() * 20 + 5; // 5-25 km
    const mockPrice = calculatePrice(mockDistance, formData.priorityLevel);

    setFormData(prev => ({
      ...prev,
      [`${type}Address`]: address,
      distanceInKm: mockDistance,
      priceEstimate: mockPrice
    }));
  };

  const calculatePrice = (distance, priority) => {
    const basePrice = 5 + (distance * 0.5);
    const multipliers = {
      'Normal': 1,
      'Urgent': 1.5,
      'Overnight': 2
    };
    return Math.round(basePrice * multipliers[priority] * 100) / 100;
  };

  const calculateDeliveryTimeEstimate = (distance, priority) => {
    const now = new Date();
    const hoursToAdd = {
      'Normal': distance * 0.3,
      'Urgent': distance * 0.2,
      'Overnight': 24
    };
    
    if (priority === 'Overnight') {
      now.setDate(now.getDate() + 1);
      now.setHours(9, 0, 0, 0);
    } else {
      now.setHours(now.getHours() + hoursToAdd[priority]);
    }
    
    return now;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      
      // Append all form data fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('packageName', formData.packageName);
      formDataToSend.append('pickupAddress', formData.pickupAddress);
      formDataToSend.append('dropoffAddress', formData.dropoffAddress);
      formDataToSend.append('note', formData.note);
      formDataToSend.append('priorityLevel', formData.priorityLevel);
      formDataToSend.append('customer', currentUser._id);
      formDataToSend.append('status', STATUS_OPTIONS.find(opt => opt.label === 'Pending').value);
      formDataToSend.append('deliveryTimeEstimate', 
        calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel)
      );
      formDataToSend.append('priceEstimate', formData.priceEstimate);
      formDataToSend.append('distanceInKm', formData.distanceInKm);

      // Handle photo upload if it's a File object (not a URL string)
      if (formData.photoUrl instanceof File) {
        formDataToSend.append('photo', formData.photoUrl);
      } else if (formData.photoUrl) {
        // If it's a URL string, just send it as is
        formDataToSend.append('photoUrl', formData.photoUrl);
      }

      // Send the request with proper headers for file upload
      const response = await axios.post(DELIVERY_API_ROUTES.CREATE, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Delivery request created successfully!');
      
      // Reset form after successful submission
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        packageName: '',
        pickupAddress: '',
        dropoffAddress: '',
        note: '',
        photoUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg',
        priorityLevel: 'Normal',
        deliveryTimeEstimate: null,
        priceEstimate: 0,
        distanceInKm: 0
      });

      navigate('/orders');
    } catch (error) {
      console.error('Delivery creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Input Component
  const EnhancedInput = ({ label, type = "text", value, onChange, placeholder, required = false, icon: Icon }) => (
    <motion.div 
      className="group"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                     focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                     dark:bg-gray-800 dark:text-white transition-all duration-300
                     hover:border-gray-300 dark:hover:border-gray-500
                     group-hover:shadow-lg`}
        />
      </div>
    </motion.div>
  );

  // Priority Level Card Component
  const PriorityCard = ({ level, title, description, multiplier, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
      }`}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-bold text-lg ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {title}
        </h4>
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
          isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
        }`}>
          {multiplier}
        </span>
      </div>
      <p className={`text-sm ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
        {description}
      </p>
    </motion.div>
  );

  // Step 1: Customer & Package Details
  const renderCustomerAndPackageDetails = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customer & Package Details
        </h3>
        
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <EnhancedInput
            label="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter your full name"
            required
          />
          
          <EnhancedInput
            label="Your Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="mb-6">
          <EnhancedInput
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="mb-6">
          <EnhancedInput
            label="Package Name"
            value={formData.packageName}
            onChange={(e) => setFormData({...formData, packageName: e.target.value})}
            placeholder="What are you sending?"
            required
            icon={Package}
          />
        </div>

        {/* Enhanced Image Upload */}
        <motion.div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Package Photo
          </label>
          <div className="flex items-start space-x-6">
            <motion.div 
              className="relative group"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={formData.photoUrl} 
                alt="Package preview" 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {formData.photoUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setFormData({...formData, photoUrl: ''})}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
            
            <div className="flex-1">
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center px-6 py-8 bg-white dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group"
              >
                <Upload className="w-8 h-1 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {formData.photoUrl ? 'Change Photo' : 'Upload Photo'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setFormData({...formData, photoUrl: imageUrl});
                    }
                  }}
                />
              </motion.label>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Priority Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Priority Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PriorityCard
              level="Normal"
              title="Standard"
              description="Regular delivery speed"
              multiplier="Base Price"
              isSelected={formData.priorityLevel === 'Normal'}
              onClick={() => {
                const newPrice = calculatePrice(formData.distanceInKm, 'Normal');
                setFormData({...formData, priorityLevel: 'Normal', priceEstimate: newPrice});
              }}
            />
            <PriorityCard
              level="Urgent"
              title="Urgent"
              description="Faster delivery"
              multiplier="+50%"
              isSelected={formData.priorityLevel === 'Urgent'}
              onClick={() => {
                const newPrice = calculatePrice(formData.distanceInKm, 'Urgent');
                setFormData({...formData, priorityLevel: 'Urgent', priceEstimate: newPrice});
              }}
            />
            <PriorityCard
              level="Overnight"
              title="Overnight"
              description="Next day delivery"
              multiplier="+100%"
              isSelected={formData.priorityLevel === 'Overnight'}
              onClick={() => {
                const newPrice = calculatePrice(formData.distanceInKm, 'Overnight');
                setFormData({...formData, priorityLevel: 'Overnight', priceEstimate: newPrice});
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Pickup Information
  const renderPickupInformation = () => (
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
          Pickup Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Where should we collect your package?
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8">
        <div className="mb-6">
          <EnhancedInput
            label="Pickup Address"
            value={formData.pickupAddress}
            onChange={(e) => handleLocationSearch(e.target.value, 'pickup')}
            placeholder="Enter pickup address"
            required
            icon={MapPin}
          />
        </div>

        <motion.div>
          <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Special Instructions
          </label>
          <motion.textarea
            whileHover={{ scale: 1.01 }}
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
            rows={4}
            className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                       focus:ring-4 focus:ring-green-500/20 focus:border-green-500 
                       dark:bg-gray-800 dark:text-white transition-all duration-300
                       hover:border-gray-300 dark:hover:border-gray-500 resize-none"
            placeholder="Building details, floor number, contact person, etc..."
          />
        </motion.div>
      </div>
    </motion.div>
  );

  // Step 3: Delivery Information
  const renderDeliveryInformation = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Delivery Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Where should we deliver your package?
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
        <div className="mb-8">
          <EnhancedInput
            label="Dropoff Address"
            value={formData.dropoffAddress}
            onChange={(e) => handleLocationSearch(e.target.value, 'dropoff')}
            placeholder="Enter delivery address"
            required
            icon={MapPin}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <h4 className="text-xl font-bold">Delivery Estimates</h4>
              </div>
              <p className="text-blue-100">
                Based on distance and priority level
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📍 {formData.distanceInKm.toFixed(1)} km
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ⚡ {formData.priorityLevel}
                </span>
              </div>
            </div>
            <motion.div 
              className="text-right"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-1">
                ${formData.priceEstimate}
              </div>
              <div className="text-blue-100 text-sm">
                Estimated Total
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Step 4: Review & Confirm
  const renderReviewAndConfirm = () => (
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
                <img src={formData.photoUrl} alt="Package" className="w-12 h-12 rounded-lg object-cover" />
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
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 p-8 rounded-2xl text-white dark:text-gray-900"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-6 h-6" />
                <h4 className="text-2xl font-bold">Order Summary</h4>
              </div>
              <p className="text-gray-300 dark:text-gray-600">
                Estimated delivery: {calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel).toLocaleDateString()} at {calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel).toLocaleTimeString()}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white/20 dark:bg-gray-800/20 px-3 py-1 rounded-full">
                  📦 {formData.packageName}
                </span>
                <span className="bg-white/20 dark:bg-gray-800/20 px-3 py-1 rounded-full">
                  📍 {formData.distanceInKm.toFixed(1)} km
                </span>
                <span className="bg-white/20 dark:bg-gray-800/20 px-3 py-1 rounded-full">
                  ⚡ {formData.priorityLevel}
                </span>
              </div>
            </div>
            <motion.div 
              className="text-right"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl font-bold mb-2">
                ${formData.priceEstimate}
              </div>
              <div className="text-gray-300 dark:text-gray-600 text-sm">
                Total Amount
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderCustomerAndPackageDetails();
      case 2: return renderPickupInformation();
      case 3: return renderDeliveryInformation();
      case 4: return renderReviewAndConfirm();
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Enhanced Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative z-10 flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? `bg-gradient-to-br ${step.color} shadow-lg`
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <step.icon className={`w-6 h-6 ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-500'
                  }`} />
                </motion.div>
                <div className="mt-3 text-center hidden md:block">
                  <p className={`text-xs font-bold ${
                    currentStep >= step.number
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-20">
                    {step.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Enhanced Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-semibold">Previous</span>
              </motion.button>

              {currentStep < steps.length ? (
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  disabled={
                    (currentStep === 1 && !formData.packageName) ||
                    (currentStep === 2 && !formData.pickupAddress) ||
                    (currentStep === 3 && !formData.dropoffAddress)
                  }
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                >
                  <span className="font-semibold">Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50 font-semibold transition-all duration-300 shadow-lg"
                >
                  {loading ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Confirm Order</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateDeliveryForm;
