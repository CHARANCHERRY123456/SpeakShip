import React from 'react';

const Avatar = ({ user, size = 48 }) => (
  <img
    src={user?.photoUrl || '/default-avatar.png'}
    alt={user?.name || 'User'}
    className={`rounded-full object-cover border border-gray-300`}
    style={{ width: size, height: size }}
    loading="lazy"
  />
);

const RoleBadge = ({ role }) => (
  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${role === 'driver' ? 'bg-blue-100 text-blue-700' : role === 'customer' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{role}</span>
);

const ReviewCard = ({ review }) => {
  if (!review) return null;
  const customer = review.customerId;
  const driver = review.driverId;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
        <div className="flex items-center gap-3">
          <Avatar user={customer} size={40} />
          <div>
            <div className="font-semibold text-gray-800 text-base sm:text-lg">{customer?.name || 'Customer'}</div>
            <RoleBadge role={customer?.role || 'customer'} />
          </div>
        </div>
        <div className="flex items-center gap-3 justify-end mt-2 sm:mt-0">
          <div className="text-right">
            <div className="font-semibold text-gray-800 text-base sm:text-lg">{driver?.name || 'Driver'}</div>
            <RoleBadge role={driver?.role || 'driver'} />
          </div>
          <Avatar user={driver} size={40} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        ))}
        <span className="ml-2 text-gray-600 font-medium">({review.rating}/5)</span>
      </div>
      <div className="text-gray-700 text-base italic mb-2 break-words">"{review.comment}"</div>
      <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 border-t pt-2 mt-2 gap-1 sm:gap-2">
        <span className="truncate">Delivery ID: {review.deliveryId}</span>
        <span>Reviewed On: {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
