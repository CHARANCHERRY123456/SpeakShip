import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import OrdersPage from './features/orders/pages';
import TrackPage from './features/track/pages';
import FeedbackPage from './features/feedback/pages';
import VoicePage from './features/voice/pages';
import LoginPage from './features/auth/pages';
import Home from './features/home/components/home';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CustomerDeliveryPage from './features/delivery/pages/CustomerDeliveryPage';
import DriverDeliveryPage from './features/delivery/pages/DriverDeliveryPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './features/profile/pages/ProfilePage'; 
import { useNavigate } from 'react-router-dom'; // <--- Add this line

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
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
 useEffect(() => {
  if (isAuthenticated && currentUser) {
    if (location.pathname === '/login') {
      navigate('/', { replace: true }); // Redirect to profile page
    }
  }
  // ... rest of the useEffect
}, [isAuthenticated, currentUser, navigate, location.pathname]);
  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8">
      <Routes>
        <Route path="/orders" element={<OrdersPage />} />
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
       <Route path="/profile" element={
         <ProtectedRoute allowedRoles={['customer', 'driver', 'admin']}>
              <ProfilePage />
       </ProtectedRoute>
        } />
        <Route path="/" element={<Home/>}/>

        {/* Add more routes as needed */}
      </Routes>
    </main>
  );
}

export default App;
