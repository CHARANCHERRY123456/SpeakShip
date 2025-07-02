// client/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { loginCustomer, loginDriver, registerCustomer, registerDriver, loginAdmin } from '../features/auth/api'; // Import your API functions
import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast for notifications

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token/user in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setCurrentUser(parsedUser);
        localStorage.setItem('isAuthenticated', 'true');
      } catch (e) {
        console.error("Failed to parse stored user data or invalid token:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.setItem('isAuthenticated', 'false');
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.setItem('isAuthenticated', 'false');
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { username, password, role } = credentials;
    let responseData;
    try {
      if (role === 'customer') {
        responseData = await loginCustomer(username, password);
      } else if (role === 'driver') {
        responseData = await loginDriver(username, password);
      } else if (role === 'admin') {
        responseData = await loginAdmin(username, password);
      } else {
        throw new Error("Invalid role specified for login.");
      }

      const userObj = responseData.customer || responseData.driver || responseData.admin;

      if (userObj && responseData.token) {
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(userObj);
        return { success: true, message: responseData.message || "Login successful." };
      } else {
        throw new Error('Authentication successful, but no token or user data received.');
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.setItem('isAuthenticated', 'false');
      throw new Error(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  const register = async (userData) => {
    const { username, name, email, password, phone, role } = userData;
    let responseData;
    try {
      if (role === 'customer') {
        responseData = await registerCustomer(username, name, email, password, phone);
      } else if (role === 'driver') {
        responseData = await registerDriver(username, name, email, password, phone);
      } else {
        throw new Error("Invalid role specified for registration.");
      }
      await login({ username, password, role }); // Automatically log in the user after successful registration
      return { success: true, message: responseData.message || "Registration successful and logged in." };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    setCurrentUser(null);
    console.log("Logged out successfully.");
  };

  // --- NEW: handleGoogleLogin function ---
  const handleGoogleLogin = (role, onSuccess, onError) => {
    if (!role || !['customer', 'driver', 'admin'].includes(role)) {
      const errorMsg = 'Please select a valid role before logging in.';
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // Use VITE_API_BASE_URL from environment variables for the backend URL
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const popup = window.open(
      `${backendUrl}/api/auth/google?role=${role}`,
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup || popup.closed || typeof popup.closed == 'undefined') {
        toast.error('Popup blocked! Please enable popups for this site to continue with Google.');
        if (onError) onError('Popup blocked!');
        return;
    }

    const receiveMessage = (event) => {
      // IMPORTANT: In production, explicitly check event.origin against your backend URL for security
      // For local development, '*' might be used or 'http://localhost:3000'
      if (event.origin !== backendUrl && event.origin !== "http://localhost:3000") { // Added 'http://localhost:3000' for local dev flexibility
          console.warn("Message from untrusted origin:", event.origin);
          return;
      }

      const { token, user, role: userRole, error } = event.data;

      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setCurrentUser(user);
        toast.success(`Welcome, ${user.name || user.username || user.email}!`);
        if (onSuccess) onSuccess(user);
        popup.close();
        window.removeEventListener('message', receiveMessage);
      } else if (error) {
        console.error('OAuth error from popup:', error);
        toast.error(`Google login failed: ${error}`);
        if (onError) onError(error);
        popup.close();
        window.removeEventListener('message', receiveMessage);
      }
    };

    window.addEventListener('message', receiveMessage);

    // Optional: Set a timeout to remove the listener if the popup doesn't respond
    const timeoutId = setTimeout(() => {
        window.removeEventListener('message', receiveMessage);
        if (!isAuthenticated) { // Only show error if still not authenticated
            toast.error('Google login timed out or failed to respond. Please try again.');
            if (onError) onError('Timeout');
            popup?.close();
        }
    }, 60000); // 60 seconds timeout

    // Clean up timeout if popup closes early
    const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkPopupClosed);
            clearTimeout(timeoutId);
            window.removeEventListener('message', receiveMessage);
        }
    }, 1000);
  };
  // --- END NEW: handleGoogleLogin function ---


  // Render children only after the initial authentication check is complete
  if (loading) {
    return <div>Loading authentication...</div>; // Or a more elaborate loading spinner
  }

  const token = localStorage.getItem('authToken'); // This should now be consistent with isAuthenticated state

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, setCurrentUser, token, login, register, logout, handleGoogleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);