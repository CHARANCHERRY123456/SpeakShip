import React, { createContext, useContext, useState, useEffect } from "react";
import { loginCustomer, loginDriver, registerCustomer, registerDriver, loginAdmin } from '../features/auth/api'; // Import your API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isAuth = localStorage.getItem('isAuthenticated');
  const [isAuthenticated, setIsAuthenticated] = useState(isAuth);
  const [customer, setCustomer] = useState(null); // To store authenticated customer/driver data
  const [loading, setLoading] = useState(true); // To manage initial loading state for auth check

  // Check for existing token/customer in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setCustomer(parsedUser);
        // Always sync isAuthenticated in localStorage
        localStorage.setItem('isAuthenticated', 'true');
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem('user');
        localStorage.setItem('isAuthenticated', 'false');
      }
    } else {
      setIsAuthenticated(false);
      setCustomer(null);
      localStorage.setItem('isAuthenticated', 'false');
    }
    setLoading(false); // Authentication check complete
  }, []);

  // Generic login handler for both customers and drivers
  // This function will be called from your useAuthForm hook
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

      if (responseData.token && (responseData.customer || responseData.driver || responseData.admin)) {
        const userObj = responseData.customer || responseData.driver || responseData.admin;
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setCustomer(userObj);
        return { success: true, message: responseData.message || "Login successful." };
      } else {
        throw new Error('Authentication successful, but no token or user data received.');
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // It's good practice to clear any partial tokens on failed login attempt
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setCustomer(null);
      throw new Error(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  // Generic register handler for both customers and drivers
  // This function will be called from your useAuthForm hook
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

      // After successful registration, you might want to automatically log them in
      // or redirect them to the login page. For now, we'll return success.
      return { success: true, message: responseData.message || "Registration successful." };

    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    setCustomer(null);
    console.log("Logged out successfully.");
  };

  // Render children only after the initial authentication check is complete
  if (loading) {
    return <div>Loading authentication...</div>; // Or a more elaborate loading spinner
  }

  const token = localStorage.getItem('authToken');

  return (
    <AuthContext.Provider value={{ isAuthenticated, customer, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);