import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginCustomer, loginDriver, registerCustomer, registerDriver, loginAdmin } from '../features/auth/api';
import profileApi from '../features/profile/apis/profile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const user = await profileApi.getProfile();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch {
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // On app load, if token exists, fetch profile from backend
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  // After login, fetch profile from backend
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
        setCurrentUser(userObj); // Use setCurrentUser
        return { success: true, message: responseData.message || "Login successful." };
      } else {
        throw new Error('Authentication successful, but no token or user data received.');
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error.message);
      // Clear any partial tokens on failed login attempt
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.setItem('isAuthenticated', 'false');
      throw new Error(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  // After registration, fetch profile from backend
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
      // return { success: true, message: responseData.message || "Registration successful." };

      // After successful registration, automatically log in the user
      // Use the same credentials for login
      await login({ username, password, role });
      return { success: true, message: responseData.message || "Registration successful and logged in." };
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  // On logout, clear user and token
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Expose a method to refresh profile after profile update
  const refreshProfile = fetchProfile;

  // Render children only after the initial authentication check is complete
  if (loading) {
    return <div>Loading authentication...</div>; // Or a more elaborate loading spinner
  }

  const token = localStorage.getItem('authToken');

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, token, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Move useAuth to a separate file to avoid Fast Refresh issues
