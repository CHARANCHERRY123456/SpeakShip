import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import OrdersPage from './features/orders/pages';
import TrackPage from './features/track/pages';
import FeedbackPage from './features/feedback/pages';
import VoicePage from './features/voice/pages';
import LoginPage from './features/auth/pages';
import Home from './features/home/components/home';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Navbar />
        <main className="max-w-5xl mx-auto w-full px-4 py-8">
          <Routes>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Home/>}/>

            {/* Add more routes as needed */}
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
