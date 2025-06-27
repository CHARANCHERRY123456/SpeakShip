// src/features/feedback/pages/ReviewsPage.jsx

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axios';
import { useAuth } from '../../../contexts/AuthContext';
import ButtonSpinner from '../../../components/ButtonSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import ReviewList from '../components/ReviewList';

const ReviewsPage = () => {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?._id) {
      setError('You are not authorized to view this page. Please log in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchReviews = async () => {
      try {
        let response;
        if (currentUser.role === 'driver') {
          response = await axiosInstance.get(`/api/feedback/driver/${currentUser._id}`);
        } else if (currentUser.role === 'customer') {
          response = await axiosInstance.get(`/api/feedback/user/${currentUser._id}`);
        } else if (currentUser.role === 'admin') {
          response = await axiosInstance.get(`/api/feedback`);
        } else {
          setError('Unsupported user role.');
          setLoading(false);
          return;
        }
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [isAuthenticated, currentUser, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
        <ButtonSpinner size={40} color="#0EA5E9" />
        <p className="mt-4 text-lg text-gray-700">Loading your reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-red-50 p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center text-sky-700 mb-10 border-b-2 border-sky-200 pb-4">
        {currentUser.role === 'driver' ? 'Your Reviews Received' : currentUser.role === 'customer' ? 'Reviews You Gave' : 'All Reviews'}
      </h1>
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsPage;
