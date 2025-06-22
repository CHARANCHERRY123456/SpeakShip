import React from 'react';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Leave a Review for Your Driver</h3>
        <form onSubmit={e => { e.preventDefault(); onClose(); toast.info('Review submitted (UI only, not saved).'); }}>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
          <select className="w-full mb-4 p-2 border rounded-lg" required>
            <option value="">Select rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Terrible</option>
          </select>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Feedback</label>
          <textarea className="w-full mb-4 p-2 border rounded-lg" rows={3} placeholder="Write your feedback..." required></textarea>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
