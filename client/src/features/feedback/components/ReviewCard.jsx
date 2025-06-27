import React, { useState } from 'react';
import { COLORS } from '../../../constants/colorConstants';
import { REVIEW } from '../../../constants/reviewConstants';
import { FaRegCopy, FaQuoteLeft } from 'react-icons/fa';

const Avatar = ({ user, size = REVIEW.AVATAR_SIZE }) => {
  const ring = REVIEW.RING_COLOR[user?.role] || REVIEW.RING_COLOR.default;
  return (
    <div className={`relative flex items-center justify-center`}>
      <img
        src={user?.photoUrl || '/default-avatar.png'}
        alt={user?.name || 'User'}
        className={`rounded-full object-cover border border-gray-300 ring ${ring}`}
        style={{ width: size, height: size, borderWidth: REVIEW.AVATAR_RING_WIDTH }}
        loading="lazy"
      />
      {!user?.photoUrl && user?.name && (
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-500 bg-gray-100 rounded-full">
          {user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

const RoleBadge = ({ role }) => (
  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${REVIEW.BADGE[role] || REVIEW.BADGE.default}`}>{role}</span>
);

const ReviewCard = ({ review }) => {
  const [copied, setCopied] = useState(false);
  if (!review) return null;
  const customer = review.customerId;
  const driver = review.driverId;
  const handleCopy = () => {
    navigator.clipboard.writeText(review.deliveryId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className={`relative ${COLORS.CARD_BG} ${COLORS.CARD_RADIUS} ${COLORS.CARD_SHADOW} border ${COLORS.BORDER} p-4 sm:p-6 flex flex-col gap-3 w-full max-w-xl mx-auto ${REVIEW.CARD_ANIMATION}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
        <div className="flex items-center gap-3">
          <Avatar user={customer} />
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
          <Avatar user={driver} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              (i < review.rating ? 'text-yellow-400' : 'text-gray-300') +
              ' text-lg ' + REVIEW.STAR_ANIMATION
            }
            style={{ transform: i < review.rating ? 'scale(1.15)' : 'scale(1)' }}
          >★</span>
        ))}
        <span className="ml-2 text-gray-600 font-medium">({review.rating}/5)</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700 text-base italic mb-2 break-words">
        <FaQuoteLeft className={REVIEW.QUOTE_COLOR + ' text-2xl -ml-1'} />
        <span>"{review.comment}"</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 border-t pt-2 mt-2 gap-1 sm:gap-2">
        <span className="truncate flex items-center gap-1">
          Delivery ID: {review.deliveryId}
          <button
            className="ml-1 p-1 rounded hover:bg-gray-100 transition"
            title="Copy Delivery ID"
            onClick={handleCopy}
            type="button"
          >
            <FaRegCopy className={copied ? 'text-green-500' : 'text-gray-400'} />
          </button>
          {copied && <span className="ml-1 text-green-500">Copied!</span>}
        </span>
        <span>Reviewed On: {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default ReviewCard;
