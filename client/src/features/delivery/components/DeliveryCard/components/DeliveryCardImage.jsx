import React from 'react';
import { ChevronDown } from 'lucide-react';

const DeliveryCardImage = ({ fullPhotoUrl, defaultPlaceholder, onClick }) => (
  <div 
    className="relative w-full h-28 md:h-40 rounded-lg overflow-hidden mb-2 cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center bg-gray-100"
    onClick={onClick}
  >
    <img
      src={fullPhotoUrl}
      alt="Delivery Item"
      className="w-full h-full object-cover object-center"
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
