// src/features/delivery/components/CreateDeliveryForm.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Package, DollarSign,Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../../api/axios.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { STATUS_OPTIONS, DELIVERY_API_ROUTES } from '../../constants/index.js';
import { fetchGeminiPrice } from '../../../../api/gemini.js';
import CustomerAndPackageStep from './components/CustomerAndPackageStep.jsx';
import PickupDropoffStep from './components/PickupDropoffStep.jsx';
import UrgencyStep from './components/UrgencyStep.jsx';
import ReviewStep from './components/ReviewStep.jsx';

// MOVED OUTSIDE: Enhanced Input Component - now receives 'name' prop
// Defining this component outside ensures it is not redefined on every render of CreateDeliveryForm,
// which helps in preventing input focus loss.
const EnhancedInput = ({ label, type = "text", name, value, onChange, placeholder, required = false, icon: Icon }) => (
  <motion.div 
    className="group"
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    <label htmlFor={name} className="block text-sm font-semibold text-gray-800 dark:text-black mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      )}
      <input
        id={name} // Use name as id for accessibility
        type={type}
        name={name} // Crucial for handleChange
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 border-gray-200 dark:border-gray-200 rounded-xl 
                    focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                    dark:bg-white dark:text-black transition-all duration-300
                    hover:border-gray-300 dark:hover:border-gray-300
                    group-hover:shadow-lg`}
      />
    </div>
  </motion.div>
);

// MOVED OUTSIDE: Priority Level Card Component
const PriorityCard = ({ level, title, description, multiplier, isSelected, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick} // This onClick will be passed from parent
    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-50 dark:to-cyan-50 shadow-lg'
        : 'border-gray-200 dark:border-gray-200 hover:border-gray-300 dark:hover:border-gray-300 bg-white dark:bg-white'
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
      <h4 className={`font-bold text-lg ${isSelected ? 'text-blue-700 dark:text-blue-700' : 'text-gray-800 dark:text-black'}`}>
        {title}
      </h4>
      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
        isSelected ? 'bg-blue-100 text-blue-700 dark:bg-blue-100 dark:text-blue-700' : 'bg-gray-100 text-gray-600 dark:bg-gray-100 dark:text-gray-600'
      }`}>
        {multiplier}
      </span>
    </div>
    <p className={`text-sm ${isSelected ? 'text-blue-600 dark:text-blue-600' : 'text-gray-600 dark:text-gray-600'}`}>
      {description}
    </p>
  </motion.div>
);


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
    photoFile: null,
    photoPreviewUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg',
    priorityLevel: 'Normal',
    weight: '', // <-- Add weight field
    deliveryTimeEstimate: null,
    priceEstimate: 0,
    distanceInKm: 0
  });

  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropoffPosition, setDropoffPosition] = useState(null);

  const [geminiSuggestedPrice, setGeminiSuggestedPrice] = useState(null);
  const [fetchingGemini, setFetchingGemini] = useState(false);

  const [urgencyPrices, setUrgencyPrices] = useState({ Normal: 0, Urgent: 0, Overnight: 0 });

  const steps = [
    { number: 1, title: 'Customer & Package Details', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { number: 2, title: 'Pickup Information', icon: MapPin, color: 'from-green-500 to-emerald-500' },
    { number: 3, title: 'Delivery Information', icon: MapPin, color: 'from-purple-500 to-pink-500' },
    { number: 4, title: 'Urgency & Price', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
    { number: 5, title: 'Review & Confirm', icon: Check, color: 'from-orange-500 to-red-500' }
  ];

  // Fetch Gemini price and distance suggestion when relevant fields change
  useEffect(() => {
    // Debounce logic to reduce excessive API calls
    const handler = setTimeout(() => {
      async function fetchGeminiEstimates() {
        if (
          formData.pickupAddress &&
          formData.dropoffAddress &&
          formData.packageName &&
          formData.priorityLevel &&
          formData.weight // Require weight
        ) {
          setFetchingGemini(true);
          try {
            const result = await fetchGeminiPrice({
              pickupAddress: formData.pickupAddress,
              dropoffAddress: formData.dropoffAddress,
              packageName: formData.packageName,
              urgency: formData.priorityLevel,
              weight: formData.weight,
            });
            setFormData(prev => ({
              ...prev,
              priceEstimate: result.price ?? 0,
              distanceInKm: result.distance ?? 0,
              deliveryTimeEstimate: result.estimatedDelivery ?? null,
            }));
          } catch (err) {
            setFormData(prev => ({
              ...prev,
              priceEstimate: 0,
              distanceInKm: 0,
              deliveryTimeEstimate: null,
            }));
          } finally {
            setFetchingGemini(false);
          }
        }
      }
      fetchGeminiEstimates();
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [formData.pickupAddress, formData.dropoffAddress, formData.packageName, formData.priorityLevel, formData.weight]);

  // Fetch all urgency prices when addresses, package, or weight change
  useEffect(() => {
    async function fetchAllUrgencyPrices() {
      if (
        formData.pickupAddress &&
        formData.dropoffAddress &&
        formData.packageName &&
        formData.weight
      ) {
        const urgencies = ['Normal', 'Urgent', 'Overnight'];
        const prices = {};
        for (const urgency of urgencies) {
          try {
            const result = await fetchGeminiPrice({
              pickupAddress: formData.pickupAddress,
              dropoffAddress: formData.dropoffAddress,
              packageName: formData.packageName,
              urgency,
              weight: formData.weight,
            });
            prices[urgency] = result.price ?? 0;
          } catch {
            prices[urgency] = 0;
          }
        }
        setUrgencyPrices(prices);
      }
    }
    fetchAllUrgencyPrices();
  }, [formData.pickupAddress, formData.dropoffAddress, formData.packageName, formData.weight]);

  // Generic handleChange function for all text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Remove handleLocationSearch mock calculation logic
  const handleLocationSearch = (address, type) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Address`]: address
    }));
  };
  

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('packageName', formData.packageName);
      data.append('pickupAddress', formData.pickupAddress);
      data.append('dropoffAddress', formData.dropoffAddress);
      data.append('note', formData.note);
      data.append('priorityLevel', formData.priorityLevel);
      data.append('weight', formData.weight); // <-- Send weight
      data.append('customer', currentUser._id);
      data.append('status', STATUS_OPTIONS.find(opt => opt.label === 'Pending').value);
      data.append('deliveryTimeEstimate', formData.deliveryTimeEstimate ? new Date(formData.deliveryTimeEstimate).toISOString() : '');
      data.append('priceEstimate', formData.priceEstimate);
      data.append('distanceInKm', formData.distanceInKm);
      if (formData.photoFile) {
        data.append('photo', formData.photoFile);
      }
      await axios.post(DELIVERY_API_ROUTES.CREATE, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Delivery request created successfully!');
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        packageName: '',
        pickupAddress: '',
        dropoffAddress: '',
        note: '',
        photoFile: null,
        photoPreviewUrl: '',
        priorityLevel: 'Normal',
        weight: '',
        deliveryTimeEstimate: null,
        priceEstimate: 0,
        distanceInKm: 0
      });
      navigate('/delivery/customer');
    } catch (error) {
      console.error('Delivery creation error:', error);
      toast.error(error.message || 'Failed to create delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToNextStep = () => {
    // Basic validation before proceeding
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.packageName) {
        toast.error('Please fill in all required Customer & Package details.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.pickupAddress) {
        toast.error('Please enter the Pickup Address.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.dropoffAddress) {
        toast.error('Please enter the Dropoff Address.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Render current step content (renamed from renderStepContent for clarity)
  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
            <CustomerAndPackageStep
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              EnhancedInput={EnhancedInput}
              // Remove PriorityCard from here
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
            <PickupDropoffStep
              pickupPosition={pickupPosition}
              setPickupPosition={setPickupPosition}
              dropoffPosition={dropoffPosition}
              setDropoffPosition={setDropoffPosition}
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              EnhancedInput={EnhancedInput}
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
            <UrgencyStep
              formData={formData}
              setFormData={setFormData}
              urgencyPrices={urgencyPrices}
              EnhancedInput={EnhancedInput}
              PriorityCard={PriorityCard}
            />
          </motion.div>
        );
      case 4:
        // Urgency & Price step: Only show price, do not allow urgency selection here
        return (
          <motion.div className="relative overflow-hidden rounded-xl shadow-xl p-0 md:p-0" style={{ minHeight: 420 }}>
            {/* Animated Gradient Background */}
            <motion.div
              className="absolute inset-0 z-0 animate-gradient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1.2 }}
            />
            <div className="relative z-10 p-6 md:p-10 flex flex-col gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <motion.h3
                className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-black drop-shadow-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
              >
                Delivery Price
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-600 text-center mb-4">
                Review and adjust the price if needed. Urgency was selected in the previous step.
              </p>
              <motion.div
                className="w-full max-w-md mx-auto bg-white/90 dark:bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-2 border-2 border-yellow-200 dark:border-yellow-200"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
              >
                <label className="block text-base font-semibold text-gray-800 dark:text-gray-800 mb-1">
                  Predicted Price (editable) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <EnhancedInput
                    label=""
                    name="priceEstimate"
                    type="number"
                    value={formData.priceEstimate}
                    onChange={handleChange}
                    icon={DollarSign}
                    required
                  />
                  <span className="text-xs text-gray-500 ml-2">System: <span className="font-semibold text-green-600">₹{urgencyPrices[formData.priorityLevel] || 0}</span></span>
                </div>
                <span className="text-xs text-gray-500">You can use the system price for better acceptance, or set your own price if you prefer.</span>
              </motion.div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
            <ReviewStep
              formData={formData}
            />
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-white flex flex-col justify-center items-center py-8">
      <div className="max-w-4xl w-full mx-auto p-0 md:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-200 bg-white dark:bg-white">
        <h2 className=" mb-8"></h2>

        {/* Progress Tracker */}
        <div className="mb-10 relative">
          <div className="w-full overflow-x-auto">
            <div className="flex justify-between items-center relative z-10 whitespace-nowrap">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center flex-1 min-w-[60px] md:min-w-[110px] relative flex-shrink-0">
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all duration-300 ease-in-out ${currentStep >= step.number ? `bg-gradient-to-br ${step.color} shadow-lg` : 'bg-gray-300 dark:bg-gray-300'}`}
                  >
                    {step.icon ? <step.icon className="w-5 h-5 md:w-6 md:h-6" /> : (currentStep > step.number ? <Check className="w-6 h-6" /> : step.number)}
                  </div>
                  <span className={`hidden md:inline mt-2 text-center text-sm md:text-base font-semibold whitespace-nowrap transition-colors duration-300 ${currentStep >= step.number ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    title={step.title}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Progress Line */}
          <div className="absolute top-5 md:top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-200 z-0">
            <motion.div
              className="h-full bg-sky-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <form 
          onSubmit={e => {
            handleSubmit(e);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && currentStep !== steps.length) {
              e.preventDefault();
            }
          }}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
                <CustomerAndPackageStep
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  EnhancedInput={EnhancedInput}
                  // Remove PriorityCard from here
                />
              </motion.div>
            )}
            {currentStep === 2 && (
              <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
                <PickupDropoffStep
                  pickupPosition={pickupPosition}
                  setPickupPosition={setPickupPosition}
                  dropoffPosition={dropoffPosition}
                  setDropoffPosition={setDropoffPosition}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  EnhancedInput={EnhancedInput}
                />
              </motion.div>
            )}
            {currentStep === 3 && (
              <motion.div className="bg-white dark:white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
                <UrgencyStep
                  formData={formData}
                  setFormData={setFormData}
                  urgencyPrices={urgencyPrices}
                  EnhancedInput={EnhancedInput}
                  PriorityCard={PriorityCard}
                />
              </motion.div>
            )}
            {currentStep === 4 && (
              <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
                {/* Urgency & Price step */}
                {renderCurrentStepContent()}
              </motion.div>
            )}
            {currentStep === 5 && (
              <motion.div className="bg-white dark:bg-white shadow-md rounded-xl border border-gray-200 dark:border-gray-200 p-4 md:p-6">
                <ReviewStep
                  formData={formData}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Navigation Buttons */}
         <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-200">
            {currentStep > 1 && (
              <motion.button
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={goToPreviousStep}
                className="flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gray-200 dark:bg-gray-200 text-gray-800 dark:text-gray-800 font-semibold text-base sm:text-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Previous
              </motion.button>
            )}

            {/* Only show Next if not on last step */}
            {currentStep < steps.length && (
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={goToNextStep}
                className={
                  `flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-sky-600 text-white font-semibold text-base sm:text-lg transition-colors hover:bg-sky-700${currentStep === 1 ? ' sm:ml-auto' : ''}`
                }
              >
                Next <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            )}

            {/* Only show Confirm Order if on last step */}
            {currentStep === steps.length && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={
                  `flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-green-600 text-white font-bold text-base sm:text-lg transition-colors hover:bg-green-700${loading ? ' opacity-70 cursor-not-allowed' : ''} sm:ml-auto`
                }
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Check className="w-5 h-5 mr-2" />
                )}
                Confirm Order
              </motion.button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateDeliveryForm;
