// src/features/delivery/components/CreateDeliveryForm.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Package, Clock, DollarSign, Upload, X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../api/axios.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { STATUS_OPTIONS, DELIVERY_API_ROUTES } from '../constants';
import MapAddressPicker from './MapAddressPicker';
import { fetchGeminiPrice } from '../../../api/gemini';
import CustomerAndPackageStep from './CustomerAndPackageStep';
import PickupDropoffStep from './PickupDropoffStep';
import UrgencyStep from './UrgencyStep';
import ReviewStep from './ReviewStep';
import { calculatePrice, calculateDeliveryTimeEstimate } from '../deliveryUtils';

// MOVED OUTSIDE: Enhanced Input Component - now receives 'name' prop
// Defining this component outside ensures it is not redefined on every render of CreateDeliveryForm,
// which helps in preventing input focus loss.
const EnhancedInput = ({ label, type = "text", name, value, onChange, placeholder, required = false, icon: Icon }) => (
  <motion.div 
    className="group"
    whileHover={{ scale: 1.01 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    <label htmlFor={name} className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
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
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                    focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                    dark:bg-gray-800 dark:text-white transition-all duration-300
                    hover:border-gray-300 dark:hover:border-gray-500
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
    photoFile: null, // Stores the actual File object for upload
    photoPreviewUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg', // Stores URL for display/initial value
    priorityLevel: 'Normal',
    deliveryTimeEstimate: null,
    priceEstimate: 0,
    distanceInKm: 0
  });

  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropoffPosition, setDropoffPosition] = useState(null);

  const [geminiSuggestedPrice, setGeminiSuggestedPrice] = useState(null);
  const [geminiPrompt, setGeminiPrompt] = useState('');
  const [geminiRaw, setGeminiRaw] = useState('');
  const [fetchingGemini, setFetchingGemini] = useState(false);

  const steps = [
    { number: 1, title: 'Customer & Package Details', icon: Package, color: 'from-blue-500 to-cyan-500' },
    { number: 2, title: 'Pickup Information', icon: MapPin, color: 'from-green-500 to-emerald-500' },
    { number: 3, title: 'Delivery Information', icon: MapPin, color: 'from-purple-500 to-pink-500' },
    { number: 4, title: 'Review & Confirm', icon: Check, color: 'from-orange-500 to-red-500' }
  ];

  // Fetch Gemini price suggestion when relevant fields change
  useEffect(() => {
    async function getGeminiPrice() {
      if (
        formData.pickupAddress &&
        formData.dropoffAddress &&
        formData.packageName &&
        formData.priorityLevel
      ) {
        setFetchingGemini(true);
        try {
          const result = await fetchGeminiPrice({
            pickupAddress: formData.pickupAddress,
            dropoffAddress: formData.dropoffAddress,
            packageName: formData.packageName,
            urgency: formData.priorityLevel,
          });
          setGeminiSuggestedPrice(result.suggestedPrice);
          setGeminiPrompt(result.prompt);
          setGeminiRaw(result.geminiRaw);
          // If user hasn't overridden, update priceEstimate
          setFormData(prev => ({
            ...prev,
            priceEstimate: prev.priceEstimate === 0 || prev.priceEstimate === prev.geminiSuggestedPrice ? result.suggestedPrice : prev.priceEstimate,
            geminiSuggestedPrice: result.suggestedPrice,
          }));
        } catch (err) {
          setGeminiSuggestedPrice(null);
          setGeminiPrompt('');
          setGeminiRaw('');
        } finally {
          setFetchingGemini(false);
        }
      }
    }
    getGeminiPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pickupAddress, formData.dropoffAddress, formData.packageName, formData.priorityLevel]);

  // Generic handleChange function for all text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Helper functions for location search and price/time calculation
  const handleLocationSearch = (address, type) => {
    const updatedFormData = {
      ...formData,
      [`${type}Address`]: address
    };
  
    if (updatedFormData.pickupAddress && updatedFormData.dropoffAddress) {
      const mockDistance = Math.random() * 20 + 5; // 5-25 km
      const mockPrice = calculatePrice(mockDistance, updatedFormData.priorityLevel);
      updatedFormData.distanceInKm = mockDistance;
      updatedFormData.priceEstimate = mockPrice;
    }
  
    setFormData(updatedFormData);
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
      data.append('customer', currentUser._id);
      data.append('status', STATUS_OPTIONS.find(opt => opt.label === 'Pending').value);
      data.append('deliveryTimeEstimate', calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel).toISOString());
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


  // Step 1: Customer & Package Details
  // const renderCustomerAndPackageDetails = () => (
  //   <motion.div 
  //     initial={{ opacity: 0, x: 20 }}
  //     animate={{ opacity: 1, x: 0 }}
  //     exit={{ opacity: 0, x: -20 }}
  //     transition={{ duration: 0.3 }}
  //     className="space-y-8"
  //   >
  //     <div className="text-center mb-8">
  //       <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
  //         <Package className="w-8 h-8 text-white" />
  //       </div>
  //       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
  //         Customer & Package Details
  //       </h3>
        
  //     </div>
      
  //     <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  //         <EnhancedInput
  //           label="Your Name"
  //           name="name"
  //           value={formData.name}
  //           onChange={handleChange} // Using generic handleChange
  //           placeholder="Enter your full name"
  //           required
  //         />
          
  //         <EnhancedInput
  //           label="Your Email"
  //           name="email"
  //           type="email"
  //           value={formData.email}
  //           onChange={handleChange} // Using generic handleChange
  //           placeholder="Enter your email address"
  //           required
  //         />
  //       </div>

  //       <div className="mb-6">
  //         <EnhancedInput
  //           label="Phone Number"
  //           name="phone"
  //           type="tel"
  //           value={formData.phone}
  //           onChange={handleChange} // Using generic handleChange
  //           placeholder="Enter your phone number"
  //         />
  //       </div>

  //       <div className="mb-6">
  //         <EnhancedInput
  //           label="Package Name"
  //           name="packageName"
  //           value={formData.packageName}
  //           onChange={handleChange} // Using generic handleChange
  //           placeholder="What are you sending?"
  //           required
  //           icon={Package}
  //         />
  //       </div>

  //       {/* Enhanced Image Upload */}
  //       <motion.div className="mb-6">
  //         <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
  //           Package Photo
  //         </label>
  //         <div className="flex items-start space-x-6">
  //           <motion.div 
  //             className="relative group"
  //             whileHover={{ scale: 1.05 }}
  //             transition={{ type: "spring", stiffness: 300, damping: 30 }}
  //           >
  //             <img 
  //               src={formData.photoPreviewUrl || 'https://placehold.co/100x100?text=No+Image'} // Use photoPreviewUrl for display
  //               alt="Package preview" 
  //               className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
  //             />
  //             {formData.photoFile || (formData.photoPreviewUrl && formData.photoPreviewUrl !== 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg') ? (
  //               <motion.button
  //                 whileHover={{ scale: 1.1 }}
  //                 whileTap={{ scale: 0.9 }}
  //                 type="button"
  //                 onClick={() => setFormData(prev => ({...prev, photoFile: null, photoPreviewUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'}))} // Reset both
  //                 className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
  //               >
  //                 <X className="w-4 h-4" />
  //               </motion.button>
  //             ) : null}
  //           </motion.div>
            
  //           <div className="flex-1">
  //             <motion.label 
  //               whileHover={{ scale: 1.02 }}
  //               whileTap={{ scale: 0.98 }}
  //               className="flex flex-col items-center justify-center px-6 py-8 bg-white dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group"
  //             >
  //               <Upload className="w-8 h-1 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
  //               <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
  //                 {formData.photoFile || (formData.photoPreviewUrl && formData.photoPreviewUrl !== 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg') ? 'Change Photo' : 'Upload Photo'}
  //               </span>
  //               <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  //                 PNG, JPG up to 10MB
  //               </span>
  //               <input 
  //                 type="file" 
  //                 name="photo" // Use 'photo' as name, matches backend field
  //                 className="hidden" 
  //                 accept="image/*"
  //                 onChange={(e) => {
  //                   const file = e.target.files[0];
  //                   if (file) {
  //                     setFormData(prev => ({
  //                       ...prev,
  //                       photoFile: file,
  //                       photoPreviewUrl: URL.createObjectURL(file) // Create URL for preview
  //                     }));
  //                   }
  //                 }}
  //               />
  //             </motion.label>
  //           </div>
  //         </div>
  //       </motion.div>

  //       {/* Enhanced Priority Selection */}
  //       <div>
  //         <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
  //           Priority Level <span className="text-red-500">*</span>
  //         </label>
  //         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //           <PriorityCard
  //             level="Normal"
  //             title="Standard"
  //             description="Regular delivery speed"
  //             multiplier="Base Price"
  //             isSelected={formData.priorityLevel === 'Normal'}
  //             onClick={() => {
  //               setFormData(prev => {
  //                   const newPrice = calculatePrice(prev.distanceInKm, 'Normal');
  //                   return {...prev, priorityLevel: 'Normal', priceEstimate: newPrice};
  //               });
  //             }}
  //           />
  //           <PriorityCard
  //             level="Urgent"
  //             title="Urgent"
  //             description="Faster delivery"
  //             multiplier="+50%"
  //             isSelected={formData.priorityLevel === 'Urgent'}
  //             onClick={() => {
  //               setFormData(prev => {
  //                   const newPrice = calculatePrice(prev.distanceInKm, 'Urgent');
  //                   return {...prev, priorityLevel: 'Urgent', priceEstimate: newPrice};
  //               });
  //             }}
  //           />
  //           <PriorityCard
  //             level="Overnight"
  //             title="Overnight"
  //             description="Next day delivery"
  //             multiplier="+100%"
  //             isSelected={formData.priorityLevel === 'Overnight'}
  //             onClick={() => {
  //               setFormData(prev => {
  //                   const newPrice = calculatePrice(prev.distanceInKm, 'Overnight');
  //                   return {...prev, priorityLevel: 'Overnight', priceEstimate: newPrice};
  //               });
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </motion.div>
  // );

  // Step 2: Pickup & Drop-off via Map
  // const renderPickupAndDropoffMap = () => (
  //   <motion.div 
  //     initial={{ opacity: 0, x: 20 }}
  //     animate={{ opacity: 1, x: 0 }}
  //     exit={{ opacity: 0, x: -20 }}
  //     transition={{ duration: 0.3 }}
  //     className="space-y-8"
  //   >
  //     <div className="text-center mb-8">
  //       <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
  //         <MapPin className="w-8 h-8 text-white" />
  //       </div>
  //       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
  //         Pickup & Drop-off Locations
  //       </h3>
  //       <p className="text-gray-600 dark:text-gray-400">
  //         Select pickup and drop-off addresses using the map below.
  //       </p>
  //     </div>
  //     <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 md:p-8">
  //       <MapAddressPicker
  //         pickupPosition={pickupPosition}
  //         setPickupPosition={latlng => {
  //           setPickupPosition(latlng);
  //         }}
  //         dropoffPosition={dropoffPosition}
  //         setDropoffPosition={latlng => {
  //           setDropoffPosition(latlng);
  //         }}
  //         pickupAddress={formData.pickupAddress}
  //         setPickupAddress={address => {
  //           setFormData(prev => ({ ...prev, pickupAddress: address }));
  //         }}
  //         dropoffAddress={formData.dropoffAddress}
  //         setDropoffAddress={address => {
  //           setFormData(prev => ({ ...prev, dropoffAddress: address }));
  //         }}
  //       />
  //       <div className="mt-6">
  //         <EnhancedInput
  //           label="Package Name"
  //           name="packageName"
  //           value={formData.packageName}
  //           onChange={handleChange}
  //           placeholder="What are you sending?"
  //           required
  //           icon={Package}
  //         />
  //       </div>
  //     </div>
  //   </motion.div>
  // );

  // Step 3: Urgency Selection
  // const renderUrgencySelection = () => (
  //   <motion.div 
  //     initial={{ opacity: 0, x: 20 }}
  //     animate={{ opacity: 1, x: 0 }}
  //     exit={{ opacity: 0, x: -20 }}
  //     transition={{ duration: 0.3 }}
  //     className="space-y-8"
  //   >
  //     <div className="text-center mb-8">
  //       <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
  //         <Clock className="w-8 h-8 text-white" />
  //       </div>
  //       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
  //         Select Delivery Urgency
  //       </h3>
  //       <p className="text-gray-600 dark:text-gray-400">
  //         Choose how fast you want your package delivered. This will affect the price.
  //       </p>
  //     </div>
  //     <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //         <PriorityCard
  //           level="Normal"
  //           title="Standard"
  //           description="Regular delivery speed"
  //           multiplier="Base Price"
  //           isSelected={formData.priorityLevel === 'Normal'}
  //           onClick={() => {
  //             const newPrice = calculatePrice(formData.distanceInKm, 'Normal');
  //             setFormData(prev => ({ ...prev, priorityLevel: 'Normal', priceEstimate: newPrice }));
  //           }}
  //         />
  //         <PriorityCard
  //           level="Urgent"
  //           title="Urgent"
  //           description="Faster delivery"
  //           multiplier="+50%"
  //           isSelected={formData.priorityLevel === 'Urgent'}
  //           onClick={() => {
  //             const newPrice = calculatePrice(formData.distanceInKm, 'Urgent');
  //             setFormData(prev => ({ ...prev, priorityLevel: 'Urgent', priceEstimate: newPrice }));
  //           }}
  //         />
  //         <PriorityCard
  //           level="Overnight"
  //           title="Overnight"
  //           description="Next day delivery"
  //           multiplier="+100%"
  //           isSelected={formData.priorityLevel === 'Overnight'}
  //           onClick={() => {
  //             const newPrice = calculatePrice(formData.distanceInKm, 'Overnight');
  //             setFormData(prev => ({ ...prev, priorityLevel: 'Overnight', priceEstimate: newPrice }));
  //           }}
  //         />
  //       </div>
  //       <div className="mt-8 text-center">
  //         <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
  //           Estimated Price: <span className="text-blue-600 dark:text-blue-400">${formData.priceEstimate}</span>
  //         </div>
  //         <div className="text-gray-600 dark:text-gray-400 text-sm">
  //           You can change urgency to see different prices.
  //         </div>
  //       </div>
  //     </div>
  //   </motion.div>
  // );

  // Step 4: Review & Confirm
  // const renderReviewAndConfirm = () => (
  //   <motion.div 
  //     initial={{ opacity: 0, x: 20 }}
  //     animate={{ opacity: 1, x: 0 }}
  //     exit={{ opacity: 0, x: -20 }}
  //     transition={{ duration: 0.3 }}
  //     className="space-y-8"
  //   >
  //     <div className="text-center mb-8">
  //       <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
  //         <Check className="w-8 h-8 text-white" />
  //       </div>
  //       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
  //         Review Your Order
  //       </h3>
  //       <p className="text-gray-600 dark:text-gray-400">
  //         Please review all details before confirming
  //       </p>
  //     </div>

  //     <div className="space-y-6">
  //       {/* Customer & Package Info */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <motion.div 
  //           whileHover={{ y: -2 }}
  //           className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800"
  //         >
  //           <div className="flex items-center mb-4">
  //             <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
  //               <Package className="w-5 h-5 text-white" />
  //             </div>
  //             <h4 className="font-bold text-gray-900 dark:text-white">Customer Details</h4>
  //           </div>
  //           <div className="space-y-2 text-sm">
  //             <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Name:</span> {formData.name}</p>
  //             <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Email:</span> {formData.email}</p>
  //             <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Phone:</span> {formData.phone}</p>
  //           </div>
  //         </motion.div>

  //         <motion.div 
  //           whileHover={{ y: -2 }}
  //           className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800"
  //         >
  //           <div className="flex items-center mb-4">
  //             <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
  //               <Package className="w-5 h-5 text-white" />
  //             </div>
  //             <h4 className="font-bold text-gray-900 dark:text-white">Package Details</h4>
  //           </div>
  //           <div className="space-y-2 text-sm">
  //             <p className="text-gray-700 dark:text-gray-300">
  //               <span className="font-medium">Item:</span> {formData.packageName}
  //             </p>
  //             <p className="text-gray-700 dark:text-gray-300">
  //               <span className="font-medium">Priority:</span> {formData.priorityLevel}
  //             </p>
  //             <div className="flex items-center mt-3">
  //               <img src={formData.photoPreviewUrl || 'https://placehold.co/100x100?text=No+Image'} alt="Package" className="w-12 h-12 rounded-lg object-cover" /> {/* Use photoPreviewUrl for display */}
  //             </div>
  //           </div>
  //         </motion.div>
  //       </div>

  //       {/* Addresses */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         <motion.div 
  //           whileHover={{ y: -2 }}
  //           className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800"
  //         >
  //           <div className="flex items-center mb-4">
  //             <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
  //               <MapPin className="w-5 h-5 text-white" />
  //             </div>
  //             <h4 className="font-bold text-gray-900 dark:text-white">Pickup Location</h4>
  //           </div>
  //           <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{formData.pickupAddress}</p>
  //           {formData.note && (
  //             <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
  //               <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Instructions:</p>
  //               <p className="text-sm text-gray-600 dark:text-gray-300">{formData.note}</p>
  //             </div>
  //           )}
  //         </motion.div>

  //         <motion.div 
  //           whileHover={{ y: -2 }}
  //           className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800"
  //         >
  //           <div className="flex items-center mb-4">
  //             <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mr-3">
  //               <MapPin className="w-5 h-5 text-white" />
  //             </div>
  //             <h4 className="font-bold text-gray-900 dark:text-white">Delivery Location</h4>
  //           </div>
  //           <p className="text-gray-700 dark:text-gray-300 text-sm">{formData.dropoffAddress}</p>
  //         </motion.div>
  //       </div>

  //       {/* Final Summary */}
  //       <motion.div 
  //         initial={{ opacity: 0, scale: 0.95 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         transition={{ delay: 0.2 }}
  //         className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 p-8 rounded-2xl text-white dark:text-gray-900"
  //       >
  //         <div className="flex items-center justify-between">
  //           <div className="space-y-3">
  //             <div className="flex items-center space-x-3">
  //               <DollarSign className="w-6 h-6" />
  //               <h4 className="text-2xl font-bold">Order Summary</h4>
  //             </div>
  //             <p className="text-gray-300 dark:text-gray-600">
  //               Estimated delivery: {calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel).toLocaleDateString()} at {calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel).toLocaleTimeString()}
  //             </p>
  //             <div className="flex items-center space-x-4 text-sm">
  //               <span className="bg-white/20 dark:bg-gray-800/20 px-3 py-1 rounded-full">
  //                 📦 {formData.packageName}
  //               </span>
  //               <span className="bg-white/20 dark:bg-gray-800/20 px-3 py-1 rounded-full">
  //                 📍 {formData.distanceInKm.toFixed(1)} km
  //               </span>
  //               <span className="bg-white/20 dark:bg-gray-800/20 px-3 py-1 rounded-full">
  //                 ⚡ {formData.priorityLevel}
  //               </span>
  //             </div>
  //           </div>
  //           <motion.div 
  //             className="text-right"
  //             whileHover={{ scale: 1.05 }}
  //           >
  //             <div className="text-5xl font-bold mb-2">
  //               ${formData.priceEstimate}
  //             </div>
  //             <div className="text-gray-300 dark:text-gray-600 text-sm">
  //               Total Amount
  //             </div>
  //           </motion.div>
  //         </div>
  //       </motion.div>
  //     </div>
  //   </motion.div>
  // );

  // Form Navigation
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
          <CustomerAndPackageStep
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            calculatePrice={calculatePrice}
            EnhancedInput={EnhancedInput}
            PriorityCard={PriorityCard}
          />
        );
      case 2:
        return (
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
        );
      case 3:
        return (
          <UrgencyStep
            formData={formData}
            setFormData={setFormData}
            calculatePrice={calculatePrice}
            PriorityCard={PriorityCard}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            calculateDeliveryTimeEstimate={calculateDeliveryTimeEstimate}
          />
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
        Create New Delivery Request
      </h2>

      {/* Progress Tracker */}
      <div className="mb-10 relative">
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center flex-1 relative">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center 
                  font-bold text-white text-lg transition-all duration-300 ease-in-out
                  ${currentStep >= step.number 
                    ? `bg-gradient-to-br ${step.color} shadow-lg` 
                    : 'bg-gray-300 dark:bg-gray-600'
                  }`}
              >
                {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
              </div>
              <p className={`mt-2 text-center text-sm md:text-base font-semibold whitespace-nowrap transition-colors duration-300
                ${currentStep >= step.number ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-0">
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
          {renderCurrentStepContent()}
        </AnimatePresence>

        {/* Form Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          {currentStep > 1 && (
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={goToPreviousStep}
              className="flex items-center px-6 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
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
                `flex items-center px-6 py-3 rounded-full bg-sky-600 text-white font-semibold transition-colors hover:bg-sky-700${currentStep === 1 ? ' ml-auto' : ''}`
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
                `flex items-center px-8 py-3 rounded-full bg-green-600 text-white font-bold text-lg transition-colors hover:bg-green-700${loading ? ' opacity-70 cursor-not-allowed' : ''} ml-auto`
              }
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Check className="w-6 h-6 mr-3" />
              )}
              Confirm Order
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateDeliveryForm;
