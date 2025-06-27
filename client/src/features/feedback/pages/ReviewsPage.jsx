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
    // --- DEBUGGING LOGS START ---
    console.log("ReviewsPage useEffect triggered:");
    console.log("  authLoading:", authLoading);
    console.log("  isAuthenticated:", isAuthenticated);
    console.log("  currentUser:", currentUser);
    if (currentUser) {
      console.log("  currentUser.role:", currentUser.role);
      console.log("  currentUser._id (checked now):", currentUser._id); // Changed to _id
    }
    // --- DEBUGGING LOGS END ---

    const fetchDriverReviews = async () => {
      // Wait for authentication status to be ready
      if (authLoading) {
        console.log("ReviewsPage: authLoading is true, returning early.");
        return;
      }

      // Check if user is authenticated and is a driver with an ID
      // Changed currentUser?.id to currentUser?._id
      if (!isAuthenticated || currentUser?.role !== 'driver' || !currentUser?._id) {
        console.log("ReviewsPage: Authorization check failed.");
        setError("You are not authorized to view this page or your driver ID is missing. Please log in as a driver.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Fetch reviews for the logged-in driver using their _id
        // Changed currentUser.id to currentUser._id
        console.log(`ReviewsPage: Attempting to fetch reviews for driver ID: ${currentUser._id}`);
        const response = await axiosInstance.get(`/api/feedback/driver/${currentUser._id}`);
        setReviews(response.data);
        console.log("ReviewsPage: Reviews fetched successfully:", response.data);
      } catch (err) {
        console.error("Error fetching driver reviews:", err);
        setError(err.response?.data?.error || "Failed to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverReviews();
  }, [isAuthenticated, currentUser, authLoading]); // Dependencies: re-run if auth state or user changes

  // --- Conditional Rendering based on state ---

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
        Your Reviews
      </h1>
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsPage;
