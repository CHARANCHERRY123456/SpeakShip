// src/features/delivery/pages/DeliveryDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeliveryById } from '../api';
import { getReviewsForDelivery, getMyReviewForDelivery, submitReview } from '../../feedback/api/review';
import ReviewForm from '../../feedback/components/ReviewForm';
import ReviewDisplay from '../../feedback/components/ReviewDisplay';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Phone, User, Truck, Tag, Calendar, Image as ImageIcon, MapPin, CheckCircle } from 'lucide-react';
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
      let driverId = null;
      if (delivery.driver && typeof delivery.driver === 'object' && delivery.driver._id) {
        driverId = delivery.driver._id;
      } else if (typeof delivery.driver === 'string') {
        driverId = delivery.driver;
      }
      if (!driverId) {
        toast.error('Driver ID is missing. Cannot submit review.');
        setReviewLoading(false);
        return;
      }
      await submitReview({ deliveryId: id, rating, comment, driverId });
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
    <div className={`${COLORS.APP_BG} min-h-screen py-6 px-2 md:px-0`}>
      <div className={`max-w-3xl mx-auto`}>
        {/* Main Card */}
        <div className={STYLES.CARD}>
          {/* Delivery Name, ID, and Status at the top */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#212121] truncate" title={delivery.packageName}>{delivery.packageName}</h1>
              <span className="text-xs text-[#616161] truncate" title={id}>ID: {id}</span>
            </div>
            <span className={`ml-0 md:ml-4 ${delivery.status === 'Delivered' ? COLORS.ACCENT_SECONDARY : delivery.status === 'Pending' ? COLORS.ACCENT_PENDING : COLORS.ACCENT} font-semibold text-base px-3 py-1 rounded-full bg-[#F4F6F8] border ${COLORS.BORDER} truncate`} title={delivery.status}>{delivery.status}</span>
          </div>
          {/* Main Content */}
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
              {/* Info section (no delivery name here) */}
              <div className="flex flex-col gap-2 mt-2">
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
                  <span className={`truncate max-w-[120px] ${delivery.status === 'Delivered' ? COLORS.ACCENT_SECONDARY : delivery.status === 'Pending' ? COLORS.ACCENT_PENDING : COLORS.ACCENT} font-semibold`} title={delivery.status}>{delivery.status}</span>
                </div>
                {delivery.note && <div className="flex items-center gap-2"><span className={STYLES.LABEL}>Note</span><span className={`truncate max-w-[180px] ${STYLES.VALUE}`} title={delivery.note}>{delivery.note}</span></div>}
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
          {/* Timeline - Modern Vertical Stepper */}
          <div className="mt-6">
            <div className={`${STYLES.SECTION_HEADING} text-[#1976D2]`}><Calendar className="h-5 w-5" />Timeline</div>
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              {/* Vertical Stepper */}
              <ol className="relative border-l-2 border-[#E0E0E0] ml-3 md:ml-0 md:w-1/2">
                {/* Created */}
                <li className="mb-8 ml-6 flex flex-col">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-[#1976D2] text-white"><Calendar className="h-4 w-4" /></span>
                  <span className="font-semibold text-[#1976D2]">Created</span>
                  <span className="text-xs text-[#616161]">{delivery.createdAt ? new Date(delivery.createdAt).toLocaleString() : 'N/A'}</span>
                </li>
                {/* In-Transit (if applicable) */}
                {delivery.status === 'In-Transit' || delivery.status === 'Delivered' ? (
                  <li className="mb-8 ml-6 flex flex-col">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-[#FF9100] text-white"><Truck className="h-4 w-4" /></span>
                    <span className="font-semibold text-[#FF9100]">In-Transit</span>
                    <span className="text-xs text-[#616161]">{delivery.updatedAt ? new Date(delivery.updatedAt).toLocaleString() : 'N/A'}</span>
                  </li>
                ) : null}
                {/* Delivered (if applicable) */}
                {delivery.status === 'Delivered' && (
                  <li className="ml-6 flex flex-col">
                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-[#00C853] text-white"><CheckCircle className="h-4 w-4" /></span>
                    <span className="font-semibold text-[#00C853]">Delivered</span>
                    <span className="text-xs text-[#616161]">{delivery.updatedAt ? new Date(delivery.updatedAt).toLocaleString() : 'N/A'}</span>
                  </li>
                )}
              </ol>
              {/* Estimated Delivery (if available) */}
              {delivery.deliveryTimeEstimate && (
                <div className="md:w-1/2 flex flex-col gap-2 mt-4 md:mt-0">
                  <span className={STYLES.LABEL}>Est. Delivery</span>
                  <span className={STYLES.VALUE}>{new Date(delivery.deliveryTimeEstimate).toLocaleString()}</span>
                </div>
              )}
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
