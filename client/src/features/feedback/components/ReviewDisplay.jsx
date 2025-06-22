// src/features/feedback/components/ReviewDisplay.jsx
import React from 'react';

const ReviewDisplay = ({ review }) => {
  if (!review) return null;
  return (
    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-gray-800 dark:text-gray-100">Rating:</span>
        <span className="text-yellow-500 text-lg">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
      </div>
      <div className="text-gray-700 dark:text-gray-200 mb-1">
        <span className="font-semibold">Comment:</span> {review.comment}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {review.customerName ? `By: ${review.customerName}` : ''} {review.createdAt ? `on ${new Date(review.createdAt).toLocaleString()}` : ''}
      </div>
    </div>
  );
};

export default ReviewDisplay;
