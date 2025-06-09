import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, loginDriver, registerUser, registerDriver, loginAdmin } from '../features/auth/api'; // Import your API functions

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // To store authenticated user/driver data
  const [loading, setLoading] = useState(true); // To manage initial loading state for auth check

  // Check for existing token/user in localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user'); // We'll store the user object now

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        // If parsing fails, clear local storage to prevent bad state
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false); // Authentication check complete
  }, []);

  // Generic login handler for both users and drivers
  // This function will be called from your useAuthForm hook
  const login = async (credentials) => {
    const { username, password, role } = credentials;
    let responseData;
    try {
      if (role === 'customer') {
        responseData = await loginUser(username, password);
      } else if (role === 'driver') {
        responseData = await loginDriver(username, password);
      } else if (role === 'admin') {
        responseData = await loginAdmin(username, password);
      } else {
        throw new Error("Invalid role specified for login.");
      }

      if (responseData.token && responseData.user) { // Backend returns 'user' for both user and driver
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user)); // Store the whole user object
        setIsAuthenticated(true);
        setUser(responseData.user);
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
      setUser(null);
      throw new Error(error.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  // Generic register handler for both users and drivers
  // This function will be called from your useAuthForm hook
  const register = async (userData) => {
    const { username, name, email, password, phone, role } = userData;
    let responseData;
    try {
      if (role === 'customer') {
        responseData = await registerUser(username, name, email, password, phone);
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
    // If you implemented a backend logout API call for cleanup, call it here
    // For JWTs, primarily it's about clearing the client-side token
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    console.log("Logged out successfully.");
  };

  // Render children only after the initial authentication check is complete
  if (loading) {
    return <div>Loading authentication...</div>; // Or a more elaborate loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);