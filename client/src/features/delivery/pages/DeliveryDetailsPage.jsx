// src/features/delivery/pages/DeliveryDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeliveryById } from '../api';
import { getReviewsForDelivery, getMyReviewForDelivery, submitReview } from '../../feedback/api/review';
import ReviewForm from '../../feedback/components/ReviewForm';
import ReviewDisplay from '../../feedback/components/ReviewDisplay';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Phone, User, Truck, Tag, Calendar, Image as ImageIcon } from 'lucide-react';

const DeliveryDetailsPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [delivery, setDelivery] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [deliveryData, reviewsData] = await Promise.all([
          getDeliveryById(id),
          getReviewsForDelivery(id)
        ]);
        setDelivery(deliveryData);
        setReviews(reviewsData);
        if (currentUser?.role === 'customer') {
          const myRev = await getMyReviewForDelivery(id);
          setMyReview(myRev);
        }
      } catch (err) {
        toast.error('Failed to load delivery details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, currentUser]);

  const handleReviewSubmit = async ({ rating, comment }) => {
    setReviewLoading(true);
    try {
      await submitReview({ deliveryId: id, rating, comment });
      toast.success('Review submitted!');
      const [reviewsData, myRev] = await Promise.all([
        getReviewsForDelivery(id),
        getMyReviewForDelivery(id)
      ]);
      setReviews(reviewsData);
      setMyReview(myRev);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Helper: fallback photo
  const defaultPhoto = 'https://housing.com/news/wp-content/uploads/2023/10/Top-10-courier-companies-in-India-ft.jpg';
  const photoUrl = delivery?.photoUrl ? (delivery.photoUrl.startsWith('http') ? delivery.photoUrl : `${delivery.photoUrl}`) : defaultPhoto;

  // OTP handler (stub, implement as needed)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    try {
      // TODO: call verifyDeliveryOtp API
      // await verifyDeliveryOtp(delivery._id, otpInput);
      toast.success('OTP verified!');
      setOtpInput('');
    } catch (err) {
      setOtpError('Invalid OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!delivery) return <div className="text-center py-12 text-red-600 dark:text-red-400">Delivery not found.</div>;

  const isCustomer = currentUser?.role === 'customer';
  const isDriver = currentUser?.role === 'driver';
  const canReview = isCustomer && delivery.status === 'Delivered' && !myReview;
  const shouldShowOtp = isCustomer && delivery.status === 'In-Transit' && delivery.deliveryOtp;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Delivery Details</h2>
      {/* Photo and main info */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-start">
        <div className="w-full md:w-48 flex-shrink-0">
          <div className="aspect-w-4 aspect-h-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            {photoUrl ? (
              <img src={photoUrl} alt="Package" className="object-cover w-full h-full" onError={e => { e.target.onerror = null; e.target.src = defaultPhoto; }} />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-400" />
            )}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{delivery.packageName}</div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span>Cost:</span>
            <span className="font-bold">₹{delivery.priceEstimate ?? 'N/A'}</span>
            <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400 ml-4" />
            <span>Distance:</span>
            <span className="font-bold">{delivery.distanceInKm ? Number(delivery.distanceInKm).toFixed(2) : 'N/A'} km</span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300"><b>Status:</b> {delivery.status}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300"><b>Pickup:</b> {delivery.pickupAddress}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300"><b>Dropoff:</b> {delivery.dropoffAddress}</div>
          {delivery.note && <div className="text-sm text-gray-600 dark:text-gray-400"><b>Note:</b> {delivery.note}</div>}
          {/* Timestamps */}
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {delivery.createdAt && <span><Calendar className="inline h-4 w-4 mr-1" />Created: {new Date(delivery.createdAt).toLocaleString()}</span>}
            {delivery.updatedAt && <span><Calendar className="inline h-4 w-4 mr-1" />Updated: {new Date(delivery.updatedAt).toLocaleString()}</span>}
          </div>
        </div>
      </div>
      {/* Driver info */}
      {delivery.driver && typeof delivery.driver === 'object' && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2"><Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />Assigned Driver</div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-500" />{delivery.driver.name || delivery.driver.username || 'N/A'}</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" />{delivery.driver.email || 'N/A'}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" />{delivery.driver.phone || 'N/A'}</div>
          </div>
        </div>
      )}
      {/* OTP Entry (customer, in-transit) */}
      {shouldShowOtp && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Enter Delivery OTP</div>
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              required
              disabled={otpLoading}
            />
            {otpError && <div className="text-red-600 text-xs">{otpError}</div>}
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60" disabled={otpLoading}>{otpLoading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>
        </div>
      )}
      {/* Review section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Reviews</h3>
        {isCustomer && myReview && <ReviewDisplay review={myReview} />}
        {isDriver && reviews.length > 0 && reviews.map(r => <ReviewDisplay key={r._id} review={r} />)}
        {canReview && <ReviewForm onSubmit={handleReviewSubmit} loading={reviewLoading} />}
        {isDriver && reviews.length === 0 && <div className="text-gray-500 dark:text-gray-400">No reviews yet.</div>}
      </div>
    </div>
  );
};

export default DeliveryDetailsPage;
