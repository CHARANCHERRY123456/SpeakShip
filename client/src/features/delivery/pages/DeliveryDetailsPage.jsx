// src/features/delivery/pages/DeliveryDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeliveryById } from '../api';
import { getReviewsForDelivery, getMyReviewForDelivery, submitReview } from '../../feedback/api/review';
import ReviewForm from '../../feedback/components/ReviewForm';
import ReviewDisplay from '../../feedback/components/ReviewDisplay';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Phone, User, Truck, Tag, Calendar, Image as ImageIcon, MapPin } from 'lucide-react';
import { COLORS, STYLES } from '../../../constants/colorConstants';

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
      // Always include driverId for feedback
      await submitReview({ deliveryId: id, rating, comment, driverId: delivery.driver?._id || delivery.driver });
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
    <div className={`${COLORS.APP_BG} min-h-screen py-6 px-2 md:px-0`}> {/* App background */}
      <div className={`max-w-3xl mx-auto`}>
        {/* Main Card */}
        <div className={STYLES.CARD}>
          <h2 className={`${STYLES.SECTION_HEADING} ${COLORS.ACCENT}`}>Delivery Details</h2>
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            {/* Left: Package Photo & Info */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="aspect-w-4 aspect-h-3 bg-[#F4F6F8] rounded-[8px] flex items-center justify-center overflow-hidden border border-[#E0E0E0]">
                {photoUrl ? (
                  <img src={photoUrl} alt="Package" className="object-cover w-full h-full" onError={e => { e.target.onerror = null; e.target.src = defaultPhoto; }} />
                ) : (
                  <ImageIcon className="w-12 h-12 text-[#1976D2]" />
                )}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="text-xl font-bold text-[#212121]">{delivery.packageName}</div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-[#1976D2]" />
                  <span className={STYLES.LABEL}>Cost</span>
                  <span className={STYLES.VALUE}>₹{delivery.priceEstimate ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#1976D2]" />
                  <span className={STYLES.LABEL}>Distance</span>
                  <span className={STYLES.VALUE}>{delivery.distanceInKm ? Number(delivery.distanceInKm).toFixed(2) : 'N/A'} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={STYLES.LABEL}>Status</span>
                  <span className={delivery.status === 'Delivered' ? STYLES.STATUS_DELIVERED : delivery.status === 'Pending' ? STYLES.STATUS_PENDING : STYLES.VALUE}>
                    {delivery.status}
                  </span>
                </div>
                {delivery.note && <div className="flex items-center gap-2"><span className={STYLES.LABEL}>Note</span><span className={STYLES.VALUE}>{delivery.note}</span></div>}
              </div>
            </div>
            {/* Right: Customer & Addresses */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div>
                <div className={`${STYLES.SECTION_HEADING} text-[#1976D2]`}><User className="h-5 w-5" />Customer Info</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-[#616161]" /><span className={STYLES.VALUE}>{delivery.customer?.name || delivery.customerName || 'N/A'}</span></div>
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#616161]" /><span className={STYLES.LABEL}>{delivery.customer?.email || delivery.customerEmail || 'N/A'}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#616161]" /><span className={STYLES.LABEL}>{delivery.customer?.phone || delivery.customerPhone || 'N/A'}</span></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#1976D2]" /><span className={STYLES.LABEL}>Pickup</span><span className={STYLES.VALUE}>{delivery.pickupAddress}</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#1976D2]" /><span className={STYLES.LABEL}>Dropoff</span><span className={STYLES.VALUE}>{delivery.dropoffAddress}</span></div>
              </div>
              {delivery.driver && typeof delivery.driver === 'object' && (
                <div className="mt-4">
                  <div className={`${STYLES.SECTION_HEADING} text-[#1976D2]`}><Truck className="h-5 w-5" />Assigned Driver</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2"><User className="h-4 w-4 text-[#616161]" /><span className={STYLES.VALUE}>{delivery.driver.name || delivery.driver.username || 'N/A'}</span></div>
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#616161]" /><span className={STYLES.LABEL}>{delivery.driver.email || 'N/A'}</span></div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#616161]" /><span className={STYLES.LABEL}>{delivery.driver.phone || 'N/A'}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Timeline */}
          <div className="mt-6">
            <div className={`${STYLES.SECTION_HEADING} text-[#1976D2]`}><Calendar className="h-5 w-5" />Timeline</div>
            <div className="flex flex-col md:flex-row gap-6 text-sm">
              <div><span className={STYLES.LABEL}>Created</span><br /><span className={STYLES.VALUE}>{delivery.createdAt ? new Date(delivery.createdAt).toLocaleString() : 'N/A'}</span></div>
              <div><span className={STYLES.LABEL}>Last Updated</span><br /><span className={STYLES.VALUE}>{delivery.updatedAt ? new Date(delivery.updatedAt).toLocaleString() : 'N/A'}</span></div>
              {delivery.deliveryTimeEstimate && <div><span className={STYLES.LABEL}>Est. Delivery</span><br /><span className={STYLES.VALUE}>{new Date(delivery.deliveryTimeEstimate).toLocaleString()}</span></div>}
            </div>
          </div>
          {/* Divider */}
          <div className={STYLES.DIVIDER}></div>
          {/* Review section */}
          <div className="mt-6">
            <div className={`${STYLES.SECTION_HEADING} text-[#1976D2]`}><Tag className="h-5 w-5" />Reviews</div>
            {isCustomer && myReview && <ReviewDisplay review={myReview} />}
            {canReview && <ReviewForm onSubmit={handleReviewSubmit} loading={reviewLoading} buttonClassName={COLORS.BUTTON_PRIMARY} />}
            {isDriver && reviews.length > 0 && reviews.map(r => <ReviewDisplay key={r._id} review={r} />)}
            {isDriver && reviews.length === 0 && <div className={STYLES.LABEL}>No reviews yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsPage;
