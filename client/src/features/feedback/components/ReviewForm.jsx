// src/features/feedback/components/ReviewForm.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ onSubmit, loading }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error('Please provide a rating and comment.');
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md space-y-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Leave a Review</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Rating:</span>
        {[1,2,3,4,5].map(star => (
          <button
            type="button"
            key={star}
            className={`text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            onClick={() => setRating(star)}
            aria-label={`Set rating to ${star}`}
          >★</button>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
        rows={3}
        placeholder="Write your feedback..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
