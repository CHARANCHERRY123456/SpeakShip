import React from 'react';

const statusStyles = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Accepted': 'bg-blue-100 text-blue-800',
  'In-Transit': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'default': 'bg-gray-100 text-gray-800'
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusStyles[status] || statusStyles.default}`}>
    {status}
  </span>
);

export default StatusBadge;
