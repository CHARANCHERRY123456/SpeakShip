// import React, { useState } from 'react';

// import { MapPin, Package, Clock, DollarSign, CheckCircle, XCircle, X, Sparkles, Truck, Star } from 'lucide-react';

// const CreateDeliveryForm = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState('success'); // 'success' or 'error'
//   const [modalMessage, setModalMessage] = useState('');
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     packageName: '',
//     pickupAddress: '',
//     dropoffAddress: '',
//     note: '',
//     photoUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg',
//     priorityLevel: 'Normal',
//     deliveryTimeEstimate: null,
//     priceEstimate: 0,
//     distanceInKm: 0
//   });

//   const steps = [
//     { number: 1, title: 'Customer & Package', icon: Package },
//     { number: 2, title: 'Pickup', icon: MapPin },
//     { number: 3, title: 'Delivery', icon: MapPin },
//     { number: 4, title: 'Review', icon: Clock }
//   ];

//   // Helper functions
//   const handleLocationSearch = async (address, type) => {
//     const mockDistance = Math.random() * 20 + 5; // 5-25 km
//     const mockPrice = calculatePrice(mockDistance, formData.priorityLevel);

//     setFormData(prev => ({
//       ...prev,
//       [`${type}Address`]: address,
//       distanceInKm: mockDistance,
//       priceEstimate: mockPrice
//     }));
//   };

//   const calculatePrice = (distance, priority) => {
//     const basePrice = 5 + (distance * 0.5);
//     const multipliers = {
//       'Normal': 1,
//       'Urgent': 1.5,
//       'Overnight': 2
//     };
//     return Math.round(basePrice * multipliers[priority] * 100) / 100;
//   };

//   const calculateDeliveryTimeEstimate = (distance, priority) => {
//     const now = new Date();
//     const hoursToAdd = {
//       'Normal': distance * 0.3,
//       'Urgent': distance * 0.2,
//       'Overnight': 24
//     };
    
//     if (priority === 'Overnight') {
//       now.setDate(now.getDate() + 1);
//       now.setHours(9, 0, 0, 0);
//     } else {
//       now.setHours(now.getHours() + hoursToAdd[priority]);
//     }
    
//     return now;
//   };

//   // Success/Error Modal Component
//   const Modal = ({ isOpen, onClose, type, message }) => {
//     if (!isOpen) return null;

//     const isSuccess = type === 'success';
    
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         {/* Backdrop */}
//         <div 
//           className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
//           onClick={onClose}
//         />
        
//         {/* Modal */}
//         <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
//           {/* Header with gradient */}
//           <div className={`relative p-6 text-center ${
//             isSuccess 
//               ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30' 
//               : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/30'
//           }`}>
//             {/* Animated background elements */}
//             <div className="absolute inset-0 overflow-hidden">
//               <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 ${
//                 isSuccess ? 'bg-green-400' : 'bg-red-400'
//               }`} />
//               <div className={`absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10 ${
//                 isSuccess ? 'bg-emerald-400' : 'bg-rose-400'
//               }`} />
//             </div>
            
//             {/* Close button */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
//             >
//               <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//             </button>
            
//             {/* Icon */}
//             <div className={`relative mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
//               isSuccess 
//                 ? 'bg-green-100 dark:bg-green-800/50' 
//                 : 'bg-red-100 dark:bg-red-800/50'
//             }`}>
//               {isSuccess ? (
//                 <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
//               ) : (
//                 <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
//               )}
              
//               {/* Sparkle animation for success */}
//               {isSuccess && (
//                 <>
//                   <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
//                   <Sparkles className="absolute -bottom-1 -left-1 w-3 h-3 text-green-400 animate-pulse delay-300" />
//                 </>
//               )}
//             </div>
            
//             {/* Title */}
//             <h3 className={`text-xl font-bold mb-2 ${
//               isSuccess 
//                 ? 'text-green-800 dark:text-green-200' 
//                 : 'text-red-800 dark:text-red-200'
//             }`}>
//               {isSuccess ? '🎉 Order Created Successfully!' : '❌ Submission Failed'}
//             </h3>
            
//             {/* Message */}
//             <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
//               {message}
//             </p>
//           </div>
          
//           {/* Footer */}
//           <div className="p-6 bg-gray-50 dark:bg-gray-700/50">
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={onClose}
//                 className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
//               >
//                 Close
//               </button>
//               {isSuccess && (
//                 <button
//                   onClick={() => {
//                     onClose();
//                     // Navigate to orders page would go here
//                     console.log('Navigate to orders');
//                   }}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
//                 >
//                   <Truck className="w-4 h-4" />
//                   View Orders
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Simulate random success/failure for demo
//       const isSuccess = Math.random() > 0.3; // 70% success rate
      
//       if (isSuccess) {
//         setModalType('success');
//         setModalMessage('Your delivery request has been created successfully! Our team will contact you shortly to confirm pickup details. You can track your order status in the Orders section.');
        
//         // Reset form after successful submission
//         setFormData({
//           name: '',
//           email: '',
//           phone: '',
//           packageName: '',
//           pickupAddress: '',
//           dropoffAddress: '',
//           note: '',
//           photoUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg',
//           priorityLevel: 'Normal',
//           deliveryTimeEstimate: null,
//           priceEstimate: 0,
//           distanceInKm: 0
//         });
//         setCurrentStep(1);
//       } else {
//         setModalType('error');
//         setModalMessage('We encountered an issue while processing your delivery request. Please check your information and try again. If the problem persists, contact our support team.');
//       }
      
//       setShowModal(true);
//     } catch (error) {
//       console.error('Delivery creation error:', error);
//       setModalType('error');
//       setModalMessage('Network error occurred. Please check your connection and try again.');
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 1: Customer & Package Details
//   const renderCustomerAndPackageDetails = () => (
//     <div className="space-y-6 md:space-y-8">
//       <div className="text-center mb-6 md:mb-8">
//         <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Customer & Package Details
//         </h3>
//         <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
//           Let's start with your information and package details
//         </p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//             Your Name *
//           </label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({...formData, name: e.target.value})}
//             className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//             required
//           />
//         </div>
        
//         <div className="space-y-2">
//           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//             Your Email *
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({...formData, email: e.target.value})}
//             className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//             required
//           />
//         </div>
//       </div>
  
//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Phone Number
//         </label>
//         <input
//           type="tel"
//           value={formData.phone}
//           onChange={(e) => setFormData({...formData, phone: e.target.value})}
//           className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//         />
//       </div>
  
//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Package Name *
//         </label>
//         <input
//           type="text"
//           value={formData.packageName}
//           onChange={(e) => setFormData({...formData, packageName: e.target.value})}
//           className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//           placeholder="What are you sending? (e.g., Documents, Electronics, Gifts)"
//           required
//         />
//       </div>
  
//       {/* Enhanced Image Upload Field */}
//       <div className="space-y-3">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Package Photo
//         </label>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
//           <div className="relative">
//             <img 
//               src={formData.photoUrl} 
//               alt="Package preview" 
//               className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 shadow-md"
//             />
//             {formData.photoUrl && (
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, photoUrl: ''})}
//                 className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 sm:p-1.5 shadow-lg transition-all duration-200"
//               >
//                 <X className="w-3 h-3" />
//               </button>
//             )}
//           </div>
//           <div className="flex-1 w-full">
//             <label className="flex flex-col items-center px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-600 cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/40 transition-all duration-200">
//               <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mb-1 sm:mb-2" />
//               <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
//                 {formData.photoUrl ? 'Change Photo' : 'Upload Photo'}
//               </span>
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files[0];
//                   if (file) {
//                     const imageUrl = URL.createObjectURL(file);
//                     setFormData({...formData, photoUrl: imageUrl});
//                   }
//                 }}
//               />
//             </label>
//             <p className="mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
//               Upload a photo of your package (optional)
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Priority Level *
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
//           {[
//             { value: 'Normal', label: 'Standard', desc: 'Regular speed', multiplier: '' },
//             { value: 'Urgent', label: 'Urgent', desc: 'Faster delivery', multiplier: '+50%' },
//             { value: 'Overnight', label: 'Overnight', desc: 'Next day', multiplier: '+100%' }
//           ].map((option) => (
//             <div
//               key={option.value}
//               onClick={() => {
//                 const newPrice = calculatePrice(formData.distanceInKm, option.value);
//                 setFormData({
//                   ...formData,
//                   priorityLevel: option.value,
//                   priceEstimate: newPrice
//                 });
//               }}
//               className={`relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
//                 formData.priorityLevel === option.value
//                   ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
//                   : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{option.label}</h4>
//                   <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
//                 </div>
//                 {option.multiplier && (
//                   <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
//                     {option.multiplier}
//                   </span>
//                 )}
//               </div>
//               {formData.priorityLevel === option.value && (
//                 <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
//                   <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // Step 2: Pickup Information
//   const renderPickupInformation = () => (
//     <div className="space-y-6 md:space-y-8">
//       <div className="text-center mb-6 md:mb-8">
//         <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Pickup Information
//         </h3>
//         <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
//           Where should we collect your package?
//         </p>
//       </div>
      
//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Pickup Address *
//         </label>
//         <input
//           type="text"
//           value={formData.pickupAddress}
//           onChange={(e) => handleLocationSearch(e.target.value, 'pickup')}
//           className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//           placeholder="Enter pickup address (e.g., 123 Main St, City, State)"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Special Instructions
//         </label>
//         <textarea
//           value={formData.note}
//           onChange={(e) => setFormData({...formData, note: e.target.value})}
//           rows={4}
//           className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//           placeholder="Any special instructions for pickup (e.g., Call when arrived, Ring doorbell, etc.)"
//         />
//       </div>
//     </div>
//   );

//   // Step 3: Delivery Information
//   const renderDeliveryInformation = () => (
//     <div className="space-y-6 md:space-y-8">
//       <div className="text-center mb-6 md:mb-8">
//         <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
//           Delivery Information
//         </h3>
//         <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
//           Where should we deliver your package?
//         </p>
//       </div>
      
//       <div className="space-y-2">
//         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
//           Dropoff Address *
//         </label>
//         <input
//           type="text"
//           value={formData.dropoffAddress}
//           onChange={(e) => handleLocationSearch(e.target.value, 'dropoff')}
//           className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
//           placeholder="Enter delivery address (e.g., 456 Oak Ave, City, State)"
//           required
//         />
//       </div>

//       <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 p-6 md:p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-800/50 rounded-xl">
//               <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
//             </div>
//             <div>
//               <h4 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
//                 Delivery Estimates
//               </h4>
//               <p className="text-sm text-blue-700 dark:text-blue-300">
//                 Based on distance and priority level
//               </p>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
//               ${formData.priceEstimate}
//             </div>
//             <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center justify-end gap-2">
//               <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
//               {formData.distanceInKm.toFixed(1)} km • {formData.priorityLevel}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Step 4: Review & Confirm
//   const renderReviewAndConfirm = () => {
//     const deliveryTime = calculateDeliveryTimeEstimate(formData.distanceInKm, formData.priorityLevel);
    
//     return (
//       <div className="space-y-6 md:space-y-8">
//         <div className="text-center mb-6 md:mb-8">
//           <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
//             Review Your Order
//           </h3>
//           <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
//             Please review all details before confirming
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
//             <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//               <Package className="w-4 h-4 sm:w-5 sm:h-5" />
//               Customer Details
//             </h4>
//             <div className="space-y-1 text-xs sm:text-sm">
//               <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Name:</span> {formData.name}</p>
//               <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Email:</span> {formData.email}</p>
//               <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Phone:</span> {formData.phone}</p>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
//             <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
//               <Package className="w-4 h-4 sm:w-5 sm:h-5" />
//               Package Details
//             </h4>
//             <div className="space-y-1 text-xs sm:text-sm">
//               <p className="text-gray-600 dark:text-gray-300">
//                 <span className="font-medium">Name:</span> {formData.packageName}
//               </p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 <span className="font-medium">Priority:</span> {formData.priorityLevel}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//           <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 p-4 md:p-6 rounded-2xl border border-green-200 dark:border-green-700">
//             <h4 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
//               <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
//               Pickup Location
//             </h4>
//             <p className="text-green-700 dark:text-green-300 text-xs sm:text-sm mb-2">{formData.pickupAddress}</p>
//             {formData.note && (
//               <div className="mt-2 p-2 bg-green-100 dark:bg-green-800/30 rounded-lg">
//                 <p className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Special Instructions:</p>
//                 <p className="text-xs text-green-700 dark:text-green-300">{formData.note}</p>
//               </div>
//             )}
//           </div>

//           <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/30 p-4 md:p-6 rounded-2xl border border-orange-200 dark:border-orange-700">
//             <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
//               <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
//               Delivery Location
//             </h4>
//             <p className="text-orange-700 dark:text-orange-300 text-xs sm:text-sm">{formData.dropoffAddress}</p>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 p-6 md:p-8 rounded-2xl border border-blue-200 dark:border-blue-700">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//             <div className="flex items-center space-x-3 sm:space-x-4">
//               <div className="p-3 sm:p-4 bg-blue-100 dark:bg-blue-800/50 rounded-xl">
//                 <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <h4 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
//                   Delivery Summary
//                 </h4>
//                 <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
//                   Estimated delivery: {deliveryTime.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 sm:gap-2">
//                 ${formData.priceEstimate}
//                 <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
//               </div>
//               <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center justify-end gap-2">
//                 <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
//                 {formData.distanceInKm.toFixed(1)} km • {formData.priorityLevel}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render current step
//   const renderStep = () => {
//     switch (currentStep) {
//       case 1: return renderCustomerAndPackageDetails();
//       case 2: return renderPickupInformation();
//       case 3: return renderDeliveryInformation();
//       case 4: return renderReviewAndConfirm();
//       default: return null;
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-4 sm:p-6">
//       {/* Enhanced Progress Steps */}
//       <div className="mb-8 sm:mb-12">
//         <div className="flex items-center justify-between">
//           {steps.map((step, index) => (
//             <div
//               key={step.number}
//               className={`flex items-center ${
//                 index < steps.length - 1 ? 'flex-1' : ''
//               }`}
//             >
//               <div className="flex flex-col items-center">
//                 <div
//                   className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
//                     currentStep >= step.number
//                       ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transform scale-110'
//                       : currentStep === step.number - 1
//                       ? 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-700 animate-pulse'
//                       : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
//                   }`}
//                 >
//                   <step.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
//                 </div>
//                 <div className="mt-2 sm:mt-3 text-center">
//                   <p className={`text-xs font-bold ${
//                     currentStep >= step.number
//                       ? 'text-blue-600 dark:text-blue-400'
//                       : 'text-gray-500'
//                   }`}>
//                     Step {step.number}
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400 max-w-16 sm:max-w-20">
//                     {step.title}
//                   </p>
//                 </div>
//               </div>
//               {index < steps.length - 1 && (
//                 <div className={`flex-1 h-1 mx-2 sm:mx-3 md:mx-6 rounded-full transition-all duration-500 ${
//                   currentStep > step.number
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600'
//                     : 'bg-gray-200 dark:bg-gray-700'
//                 }`} />
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Enhanced Form Content */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10 relative overflow-hidden">
//         {/* Background decoration */}
//         <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-bl from-blue-50 to-transparent dark:from-blue-900/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32 pointer-events-none" />
//         <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-indigo-50 to-transparent dark:from-indigo-900/10 rounded-full translate-y-12 sm:translate-y-24 -translate-x-12 sm:-translate-x-24 pointer-events-none" />
        
//         <div className="relative z-10">
//           {renderStep()}

//           {/* Enhanced Navigation Buttons */}
//           <div className="flex justify-between mt-8 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-gray-100 dark:border-gray-700">
//             <button
//               onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//               disabled={currentStep === 1}
//               className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2 text-sm sm:text-base"
//             >
//               <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Previous
//             </button>

//             {currentStep < steps.length ? (
//               <button
//                 onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
//                 disabled={
//                   (currentStep === 1 && !formData.packageName) ||
//                   (currentStep === 2 && !formData.pickupAddress) ||
//                   (currentStep === 3 && !formData.dropoffAddress)
//                 }
//                 className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
//               >
//                 Next
//                 <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg sm:rounded-xl disabled:opacity-50 transition-all duration-200 font-semibold flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     <span>Creating Order...</span>
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
//                     <span>Confirm Order</span>
//                   </>
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal 
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         type={modalType}
//         message={modalMessage}
//       />
//     </div>
//   );
// };

// export default CreateDeliveryForm;

import React, { useState } from 'react';
import { MapPin, Package, Clock, DollarSign, Upload, X, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

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
      formDataToSend.append('status', 'Pending');
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
      const response = await axios.post('/api/create', formDataToSend, {
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
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Item:</span> {formData.packageName}</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Priority:</span> {formData.priorityLevel}</p>
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
