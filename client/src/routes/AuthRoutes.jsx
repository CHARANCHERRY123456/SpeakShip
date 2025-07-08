import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import CustomerOrdersPage from '../features/orders/pages/CustomerOrders';
import DriverOrdersPage from '../features/orders/pages/DriverOrdersPage';
import TrackPage from '../features/track/pages';
import FeedbackPage from '../features/feedback/pages';
import VoicePage from '../features/voice/pages';
import LoginPage from '../features/auth/pages';
import Home from '../features/home';
import ContactUs from '../features/contactus';
import AboutUs from '../features/aboutus';
import CustomerDeliveryPage from '../features/delivery/pages/CustomerDeliveryPage';
import DriverDeliveryPage from '../features/delivery/pages/DriverDeliveryPage';
import DeliveryDetailsPage from '../features/delivery/pages/DeliveryDetailsPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import ReviewsPage from '../features/feedback/pages/ReviewsPage';

import ProtectedRoute from '../components/ProtectedRoute';
import Footer from '../components/Footer/Footer';

const AuthRoutes = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && currentUser && location.pathname === '/login') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, currentUser, location.pathname, navigate]);

  return (
    <>
      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<CustomerOrdersPage />} />
          <Route
            path="/orders/driver"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/voice" element={<VoicePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/delivery/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDeliveryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/driver"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDeliveryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/delivery/:id" element={<DeliveryDetailsPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['customer', 'driver', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute allowedRoles={['driver', 'customer']}>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {location.pathname !== '/login' && <Footer />}
    </>
  );
};

export default AuthRoutes;
