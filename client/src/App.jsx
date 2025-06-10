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
  const { isAuthenticated, customer } = useAuth();
  useEffect(() => {
    if (isAuthenticated && customer) {
      if (window.location.pathname === '/') {
        if (customer.role === 'customer') {
          window.location.replace('/delivery/customer');
        } else if (customer.role === 'driver') {
          window.location.replace('/delivery/driver');
        }
      }
    }
  }, [isAuthenticated, customer]);
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
        <Route path="/" element={<Home/>}/>

        {/* Add more routes as needed */}
      </Routes>
    </main>
  );
}

export default App;
