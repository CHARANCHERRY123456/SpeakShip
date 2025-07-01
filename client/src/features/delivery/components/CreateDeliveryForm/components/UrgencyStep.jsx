import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const UrgencyStep = ({ formData, setFormData, PriorityCard }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-8"
  >
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-900 mb-2">
        Select Delivery Urgency
      </h3>
      <p className="text-gray-600 dark:text-gray-600">
        Choose how fast you want your package delivered. This will affect the price.
      </p>
    </div>
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-50 dark:to-pink-50 rounded-2xl p-8">
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
  </motion.div>
);

export default UrgencyStep;
