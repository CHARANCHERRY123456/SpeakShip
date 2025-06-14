import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  // Destructure isAuthenticated and currentUser from useAuth
  const { isAuthenticated, currentUser, loading } = useAuth();



  if (loading) {
    return <div>Loading authentication...</div>;
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
