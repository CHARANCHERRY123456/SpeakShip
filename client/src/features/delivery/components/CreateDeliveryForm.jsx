import React, { useState } from 'react';
import { MapPin, Package, Clock, DollarSign, CheckCircle, XCircle, X, Sparkles, Truck, Star } from 'lucide-react';

const CreateDeliveryForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('success'); // 'success' or 'error'
  const [modalMessage, setModalMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    { number: 1, title: 'Customer & Package', icon: Package },
    { number: 2, title: 'Pickup', icon: MapPin },
    { number: 3, title: 'Delivery', icon: MapPin },
    { number: 4, title: 'Review', icon: Clock }
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

  // Success/Error Modal Component
  const Modal = ({ isOpen, onClose, type, message }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
          {/* Header with gradient */}
          <div className={`relative p-6 text-center ${
            isSuccess 
              ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30' 
              : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/30'
          }`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 ${
                isSuccess ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <div className={`absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10 ${
                isSuccess ? 'bg-emerald-400' : 'bg-rose-400'
              }`} />
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Icon */}
            <div className={`relative mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isSuccess 
                ? 'bg-green-100 dark:bg-green-800/50' 
                : 'bg-red-100 dark:bg-red-800/50'
            }`}>
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              )}
              
              {/* Sparkle animation for success */}
              {isSuccess && (
                <>
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                  <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-green-400 animate-pulse delay-300" />
                </>
              )}
            </div>
            
            {/* Title */}
            <h3 className={`text-xl font-bold mb-2 ${
              isSuccess 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {isSuccess ? '🎉 Order Created Successfully!' : '❌ Submission Failed'}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
              >
                Close
              </button>
              {isSuccess && (
                <button
                  onClick={() => {
                    onClose();
                    // Navigate to orders page would go here
                    console.log('Navigate to orders');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  View Orders
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3; // 70% success rate
      
      if (isSuccess) {
        setModalType('success');
        setModalMessage('Your delivery request has been created successfully! Our team will contact you shortly to confirm pickup details. You can track your order status in the Orders section.');
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
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
        setCurrentStep(1);
      } else {
        setModalType('error');
        setModalMessage('We encountered an issue while processing your delivery request. Please check your information and try again. If the problem persists, contact our support team.');
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Delivery creation error:', error);
      setModalType('error');
      setModalMessage('Network error occurred. Please check your connection and try again.');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Customer & Package Details
  const renderCustomerAndPackageDetails = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customer & Package Details
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Let's start with your information and package details
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Your Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Your Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
          />
        </div>
      </div>
  
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
        />
      </div>
  
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Package Name *
        </label>
        <input
          type="text"
          value={formData.packageName}
          onChange={(e) => setFormData({...formData, packageName: e.target.value})}
          className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          placeholder="What are you sending? (e.g., Documents, Electronics, Gifts)"
          required
        />
      </div>
  
      {/* Enhanced Image Upload Field */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Package Photo
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <img 
              src={formData.photoUrl} 
              alt="Package preview" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md"
            />
            {formData.photoUrl && (
              <button
                type="button"
                onClick={() => setFormData({...formData, photoUrl: ''})}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 sm:p-1.5 shadow-lg transition-all duration-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="flex flex-col items-center px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/40 transition-all duration-200">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
                {formData.photoUrl ? 'Change Photo' : 'Upload Photo'}
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
            </label>
            <p className="mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
              Upload a photo of your package (optional)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Priority Level *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {[
            { value: 'Normal', label: 'Standard', desc: 'Regular speed', multiplier: '' },
            { value: 'Urgent', label: 'Urgent', desc: 'Faster delivery', multiplier: '+50%' },
            { value: 'Overnight', label: 'Overnight', desc: 'Next day', multiplier: '+100%' }
          ].map((option) => (
            <div
              key={option.value}
              onClick={() => {
                const newPrice = calculatePrice(formData.distanceInKm, option.value);
                setFormData({
                  ...formData,
                  priorityLevel: option.value,
                  priceEstimate: newPrice
                });
              }}
              className={`relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                formData.priorityLevel === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{option.label}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                </div>
                {option.multiplier && (
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
                    {option.multiplier}
                  </span>
                )}
              </div>
              {formData.priorityLevel === option.value && (
                <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 2: Pickup Information
  const renderPickupInformation = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pickup Information
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Where should we collect your package?
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Pickup Address *
        </label>
        <input
          type="text"
          value={formData.pickupAddress}
          onChange={(e) => handleLocationSearch(e.target.value, 'pickup')}
          className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          placeholder="Enter pickup address (e.g., 123 Main St, City, State)"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Special Instructions
        </label>
        <textarea
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
          rows={4}
          className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          placeholder="Any special instructions for pickup (e.g., Call when arrived, Ring doorbell, etc.)"
        />
      </div>
    </div>
  );

  // Step 3: Delivery Information
  const renderDeliveryInformation = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center mb-6 md:mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Delivery Information
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          Where should we deliver your package?
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Dropoff Address *
        </label>
        <input
          type="text"
          value={formData.dropoffAddress}
          onChange={(e) => handleLocationSearch(e.target.value, 'dropoff')}
          className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          placeholder="Enter delivery address (e.g., 456 Oak Ave, City, State)"
          required
        />
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 p-6 md:p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-800/50 rounded-xl">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
                Delivery Estimates
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Based on distance and priority level
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
              ${formData.priceEstimate}
            </div>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center justify-end gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              {formData.distanceInKm.toFixed(1)} km • {formData.priorityLevel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Review & Confirm
  const renderReviewAndConfirm = () => {
    const deliveryTime = calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel);
    
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Review Your Order
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Please review all details before confirming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Customer Details
            </h4>
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Name:</span> {formData.name}</p>
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Email:</span> {formData.email}</p>
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Phone:</span> {formData.phone}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Package Details
            </h4>
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Name:</span> {formData.packageName}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Priority:</span> {formData.priorityLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 p-4 md:p-6 rounded-2xl border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Pickup Location
            </h4>
            <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm mb-2">{formData.pickupAddress}</p>
            {formData.note && (
              <div className="mt-2 p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
                <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Special Instructions:</p>
                <p className="text-xs text-green-700 dark:text-green-300">{formData.note}</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/30 p-4 md:p-6 rounded-2xl border border-orange-200 dark:border-orange-700">
            <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Delivery Location
            </h4>
            <p className="text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{formData.dropoffAddress}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 p-6 md:p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-800/50 rounded-xl">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
                  Delivery Summary
                </h4>
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  Estimated delivery: {deliveryTime.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 sm:gap-2">
                ${formData.priceEstimate}
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center justify-end gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                {formData.distanceInKm.toFixed(1)} km • {formData.priorityLevel}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Enhanced Progress Steps */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform scale-110'
                      : currentStep === step.number - 1
                      ? 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-700 animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>
                <div className="mt-2 sm:mt-3 text-center">
                  <p className={`text-xs font-bold ${
                    currentStep >= step.number
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500'
                  }`}>
                    Step {step.number}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 max-w-16 sm:max-w-20">
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 sm:mx-3 md:mx-6 rounded-full transition-all duration-500 ${
                  currentStep > step.number
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-indigo-50 to-transparent dark:from-indigo-900/10 rounded-full translate-y-12 sm:translate-y-24 -translate-x-12 sm:-translate-x-24 pointer-events-none" />
        
        <div className="relative z-10">
          {renderStep()}

          {/* Enhanced Navigation Buttons */}
          <div className="flex justify-between mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-100 dark:border-gray-700">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={
                  (currentStep === 1 && !formData.packageName) ||
                  (currentStep === 2 && !formData.pickupAddress) ||
                  (currentStep === 3 && !formData.dropoffAddress)
                }
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Next
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg sm:rounded-xl disabled:opacity-50 transition-all duration-200 font-semibold flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Confirm Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        message={modalMessage}
      />
    </div>
  );
};

export default CreateDeliveryForm;