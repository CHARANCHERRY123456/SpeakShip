import React from 'react';
import { Truck, Tag } from 'lucide-react';

const DeliveryCardInfo = ({ delivery, isDriverView }) => (
  !isDriverView && (
    <div className="mb-3 space-y-1">
      {delivery.driver && typeof delivery.driver === 'object' && delivery.driver !== null && (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Assigned to:</span>
          <span className="text-sky-700 dark:text-sky-400">{delivery.driver.name || delivery.driver.username || 'N/A'}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="font-medium">Charge:</span>
        <span className="text-gray-600 dark:text-gray-400 font-semibold">₹{delivery.priceEstimate}</span>
      </div>
    </div>
  )
);

export default DeliveryCardInfo;
