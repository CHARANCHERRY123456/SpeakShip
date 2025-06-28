import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import CustomerOrdersPage from './features/orders/pages/CustomerOrders';
import TrackPage from './features/track/pages';
import FeedbackPage from './features/feedback/pages';
import VoicePage from './features/voice/pages';
import { Toaster } from 'react-hot-toast';
import LoginPage from './features/auth/pages';
import Home from './features/home/home';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CustomerDeliveryPage from './features/delivery/pages/CustomerDeliveryPage';
import DriverDeliveryPage from './features/delivery/pages/DriverDeliveryPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './features/profile/pages/ProfilePage'; 
import { useNavigate } from 'react-router-dom';
import DriverOrdersPage from './features/orders/pages/DriverOrdersPage';
import DeliveryDetailsPage from './features/delivery/pages/DeliveryDetailsPage';
import ReviewsPage from './features/feedback/pages/ReviewsPage';
import Footer from './components/Footer/Footer';
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <Router>
          <Navbar />
          <AuthRoutes />
        </Router>
      </AuthProvider>
    </div>
  );
}

function AuthRoutes() {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (location.pathname === '/login') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, location.pathname]);

  return (
    <>
      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-grow">
        <Routes>
          <Route path="/orders" element={<CustomerOrdersPage />} />
          <Route path="/orders/driver" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/voice" element={<VoicePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/delivery/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDeliveryPage />
            </ProtectedRoute>
          } />
          <Route path="/delivery/driver" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDeliveryPage />
            </ProtectedRoute>
          } />
          <Route path="/delivery/:id" element={<DeliveryDetailsPage />} />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['customer', 'driver', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home/>}/>
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
}

export default App;