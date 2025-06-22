import React from 'react';
import { ChevronDown } from 'lucide-react';

const DeliveryCardImage = ({ fullPhotoUrl, defaultPlaceholder, onClick }) => (
  <div 
    className="relative w-full h-48 rounded-lg overflow-hidden mb-4 cursor-pointer hover:opacity-90 transition-opacity"
    onClick={onClick}
  >
    <img
      src={fullPhotoUrl}
      alt="Delivery Item"
      className="w-full h-full object-cover"
      onError={e => {
        e.target.onerror = null;
        e.target.src = defaultPlaceholder;
      }}
    />
    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
      <ChevronDown className="h-5 w-5 text-white" />
    </div>
  </div>
);

export default DeliveryCardImage;
