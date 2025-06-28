// client/src/pages/Auth/GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path if needed
import {LoaderCircle } from 'lucide-react'; // For a loading spinner

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth(); // Assuming login handles setting auth state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userDataString = params.get('user');
    const role = params.get('role');

    if (token && userDataString && role) {
      try {
        const user = JSON.parse(decodeURIComponent(userDataString));
        // Use your AuthContext's login function to set the state and local storage
        // You might need a specific 'googleLogin' function in AuthContext
        // that directly takes token and user object, or adapt your existing 'login'.
        // For simplicity, let's directly set localStorage and state here for now,
        // but ideally, AuthContext would provide a dedicated method.

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');

        // You'll need to dispatch these to your AuthContext or call a function within it.
        // A direct way without exposing setCurrentUser/setIsAuthenticated from context:
        // You could update your AuthContext to have a `setAuthData` function.
        // For now, let's simulate calling login if it fits the schema.
        // If `login` expects username/password, you might need a different context function.
        // A better approach is often a `handleExternalLogin` in AuthContext.

        // Assuming your AuthContext can take a direct user/token update:
        // Or, if `login` can be modified to accept a pre-authenticated state:
        // await handleGoogleCallbackFromContext(token, user, role); // This would be ideal

        // As a temporary workaround if AuthContext doesn't have a direct setter:
        // console.log("Google callback received. Manually setting auth state...");
        // This part needs refinement depending on how your `AuthContext` exposes setters or a dedicated external login function.
        // For now, if `login` in AuthContext expects `credentials`, we cannot directly use it here.
        // The `handleGoogleCallback` function you added to AuthContext IS meant for this.
        // Let's call it from the context:

        (async () => {
          try {
            // Calling the handleGoogleCallback function from AuthContext
            // Note: Your handleGoogleCallback currently expects 'code' as first arg, not 'token'.
            // You might need to adjust your backend to send 'code' and let frontend exchange it,
            // or modify handleGoogleCallback to take (token, user, role).
            // For now, assuming handleGoogleCallback can take `token` and `role`
            // and internally handles the 'code' exchange if backend still uses it.
            // *** IMPORTANT: Adjust `googleLoginCallback` in `api.js` if it expects a `code`
            // when your backend is sending `token` directly to frontend.
            // If backend sends token, frontend should just set it directly.

            // Scenario 1: Backend sends token directly to frontend in URL params
            // This is the simplest if your backend directly gives you a token.
            const authContext = useAuth();
            if (authContext && authContext.setCurrentUser && authContext.setIsAuthenticated) {
                 authContext.setCurrentUser(user);
                 authContext.setIsAuthenticated(true);
                 localStorage.setItem('authToken', token);
                 localStorage.setItem('user', JSON.stringify(user));
                 localStorage.setItem('isAuthenticated', 'true');
                 navigate('/'); // Redirect to home/dashboard
            } else {
                 console.error("AuthContext setters not available. Cannot set user state.");
                 setError("Authentication failed: Internal error.");
            }

            // Scenario 2 (Previous design): Backend still expects frontend to exchange code
            // If your backend still adheres to the `code` exchange:
            // await handleGoogleCallback(token, role); // Assuming handleGoogleCallback can process this

          } catch (e) {
            console.error("Error setting auth state after Google callback:", e);
            setError("Failed to log in with Google. Please try again.");
            navigate('/login'); // Redirect to login on failure
          } finally {
            setLoading(false);
          }
        })();

      } catch (e) {
        console.error("Failed to parse user data from URL:", e);
        setError("Failed to process Google login data.");
        setLoading(false);
        navigate('/login'); // Redirect to login on parsing error
      }
    } else {
      setError("Missing authentication data in URL.");
      setLoading(false);
      navigate('/login'); // Redirect to login if data is missing
    }
  }, [isAuthenticated, location.search, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <LoaderCircle className="h-10 w-10 animate-spin text-sky-500" />
          <p className="mt-4 text-gray-700">Logging you in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Login Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null; // Should redirect before rendering anything else
};

export default GoogleCallback;