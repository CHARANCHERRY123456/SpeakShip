import React from 'react';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../../core/components/LoadingSpinner';

const ReviewList = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-500 dark:text-gray-400">
        <span className="text-4xl mb-2">⭐</span>
        <div className="text-lg font-semibold">No Reviews Yet!</div>
        <div className="text-sm">It looks like there are no reviews to display.</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
