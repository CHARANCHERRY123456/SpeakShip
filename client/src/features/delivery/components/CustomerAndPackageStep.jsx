import React from 'react';
import { motion } from 'framer-motion';
import { Package, Upload, X, Check } from 'lucide-react';

// EnhancedInput and PriorityCard should be imported from their respective files if split further
const CustomerAndPackageStep = ({ formData, setFormData, handleChange, EnhancedInput, PriorityCard }) => (
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
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />
        <EnhancedInput
          label="Your Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />
      </div>
      <div className="mb-6">
        <EnhancedInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>
      <div className="mb-6">
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
      {/* Weight input */}
      <div className="mb-6">
        <EnhancedInput
          label="Package Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight in kg"
          required
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img 
              src={formData.photoPreviewUrl || 'https://placehold.co/100x100?text=No+Image'}
              alt="Package preview" 
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
            />
            {formData.photoFile || (formData.photoPreviewUrl && formData.photoPreviewUrl !== 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg') ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setFormData(prev => ({...prev, photoFile: null, photoPreviewUrl: 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg'}))}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            ) : null}
          </motion.div>
          <div className="flex-1">
            <motion.label 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center px-6 py-8 bg-white dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group"
            >
              <Upload className="w-8 h-1 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {formData.photoFile || (formData.photoPreviewUrl && formData.photoPreviewUrl !== 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg') ? 'Change Photo' : 'Upload Photo'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG up to 10MB
              </span>
              <input 
                type="file" 
                name="photo"
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData(prev => ({
                      ...prev,
                      photoFile: file,
                      photoPreviewUrl: URL.createObjectURL(file)
                    }));
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
              setFormData(prev => ({ ...prev, priorityLevel: 'Normal' }));
            }}
          />
          <PriorityCard
            level="Urgent"
            title="Urgent"
            description="Faster delivery"
            multiplier="+50%"
            isSelected={formData.priorityLevel === 'Urgent'}
            onClick={() => {
              setFormData(prev => ({ ...prev, priorityLevel: 'Urgent' }));
            }}
          />
          <PriorityCard
            level="Overnight"
            title="Overnight"
            description="Next day delivery"
            multiplier="+100%"
            isSelected={formData.priorityLevel === 'Overnight'}
            onClick={() => {
              setFormData(prev => ({ ...prev, priorityLevel: 'Overnight' }));
            }}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default CustomerAndPackageStep;
