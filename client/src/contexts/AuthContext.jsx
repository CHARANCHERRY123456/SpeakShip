import React, { createContext, useContext, useState, useEffect } from "react";
import { loginCustomer, loginDriver, registerCustomer, registerDriver, loginAdmin } from '../features/auth/api'; // Import your API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Use 'currentUser' for the authenticated user object, regardless of role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Renamed 'customer' to 'currentUser'
  const [loading, setLoading] = useState(true); // To manage initial loading state for auth check

  // Check for existing token/user in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setCurrentUser(parsedUser); // Use setCurrentUser
        localStorage.setItem('isAuthenticated', 'true');
      } catch (e) {
        console.error("Failed to parse stored user data or invalid token:", e);
        localStorage.removeItem('authToken'); // Clear invalid data
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
    setLoading(false); // Authentication check complete
  }, []);

  // Generic login handler for customers, drivers, and admins
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

  // Generic register handler for customers and drivers
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
      return { success: true, message: responseData.message || "Registration successful." };

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
    setCurrentUser(null); // Use setCurrentUser
    console.log("Logged out successfully.");
  };

  // Render children only after the initial authentication check is complete
  if (loading) {
    return <div>Loading authentication...</div>; // Or a more elaborate loading spinner
  }

  const token = localStorage.getItem('authToken');

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
