import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import AuthRoutes from './routes/AuthRoutes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <SocketProvider> 
        <AuthProvider>
          <Router>
            <Navbar />
            <AuthRoutes />
          </Router>
        </AuthProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
