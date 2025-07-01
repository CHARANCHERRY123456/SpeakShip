import React from 'react';
import StatusBadge from '../StatusBadge';

const DeliveryCardHeader = ({ packageName, id, status }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
    <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-800 break-words truncate max-w-full">
      {packageName || 'Package'} #{id.substring(0, 8)}
    </h3>
    <StatusBadge status={status} />
  </div>
);

export default DeliveryCardHeader;
