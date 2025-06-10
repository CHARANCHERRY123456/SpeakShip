import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import React, { useEffect } from 'react'; // Import React and useEffect for debugging logs

export default function ProtectedRoute({ children, allowedRoles }) {
  // Destructure isAuthenticated and currentUser from useAuth
  const { isAuthenticated, currentUser, loading } = useAuth(); // Also get 'loading' state from AuthContext

  // --- DEBUGGING LOGS ---
  useEffect(() => {
    console.log("ProtectedRoute - Render Check:");
    console.log("  isAuthenticated:", isAuthenticated);
    console.log("  currentUser:", currentUser);
    if (currentUser) {
      console.log("  currentUser.role:", currentUser.role);
    }
    console.log("  allowedRoles:", allowedRoles);
    console.log("  AuthContext Loading:", loading);
  }, [isAuthenticated, currentUser, allowedRoles, loading]);

  // If AuthContext is still loading the initial authentication state, show a loading message
  if (loading) {
    console.log("ProtectedRoute - Path: AuthContext is still loading.");
    return <div>Loading authentication...</div>; // Or a more visually appealing spinner
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Path: Not authenticated, redirecting to /login.");
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no user data (shouldn't happen often if isAuthenticated is true)
  if (!currentUser) {
    console.log("ProtectedRoute - Path: Authenticated but no currentUser data, redirecting to /login.");
    // This could happen if localStorage is corrupted or user data isn't parsed
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is allowed for this route
  if (!allowedRoles.includes(currentUser.role)) {
    console.log(`ProtectedRoute - Path: Role '${currentUser.role}' not in allowed roles [${allowedRoles.join(', ')}], redirecting to /.`);
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child components
  console.log("ProtectedRoute - Path: All checks passed, rendering children.");
  return children;
}
