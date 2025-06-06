import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, Mail, Lock, ArrowRight, Eye, EyeOff, User, MapPin } from 'lucide-react'; // Added MapPin icon

// Define a placeholder for your backend API base URL
// In a real application, you'd load this from environment variables.
const API_BASE_URL = 'http://localhost:3000/api/auth'; // Replace with your actual backend URL

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(''); // New state for address
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressError, setAddressError] = useState(''); // New state for address validation error

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for role selection
  const [role, setRole] = useState('customer'); // Default role

  // Check for authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserRole = localStorage.getItem('userRole');
    if (token && storedUserEmail && storedUserRole) {
      setIsAuthenticated(true);
      setUserEmail(storedUserEmail);
      setUserRole(storedUserRole);
    }
  }, []);

  // Email validation function
  const validateEmail = (inputEmail) => {
    if (!inputEmail) {
      setEmailError('Email is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Password validation function
  const validatePassword = (inputPassword) => {
    if (!inputPassword) {
      setPasswordError('Password is required.');
      return false;
    }
    if (inputPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return false;
    }
    const hasUppercase = /[A-Z]/.test(inputPassword);
    if (!hasUppercase) {
      setPasswordError('Password must contain at least one uppercase letter.');
      return false;
    }
    const hasLowercase = /[a-z]/.test(inputPassword);
    if (!hasLowercase) {
      setPasswordError('Password must contain at least one lowercase letter.');
      return false;
    }
    const hasNumber = /[0-9]/.test(inputPassword);
    if (!hasNumber) {
      setPasswordError('Password must contain at least one number.');
      return false;
    }
    const hasSpecialChar = /[\\\[\]{}|;:'",.<>\/?~!@#$%^&*()_+\-=]/.test(inputPassword);
    if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character (e.g., !@#$%^&*).');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Address validation function
  const validateAddress = (inputAddress) => {
    if (!inputAddress && !isLogin) { // Only validate if signing up
      setAddressError('Address is required.');
      return false;
    }
    setAddressError('');
    return true;
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  // Handle address input change
  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    validateAddress(newAddress);
  };

  // Handle role selection change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Handle email/password submission (Login or Signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isAddressValid = isLogin || validateAddress(address); // Validate address only on signup

    if (!isEmailValid || !isPasswordValid || !isAddressValid) {
      return;
    }

    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
    const method = 'POST';

    try {
      const requestBody = isLogin ? { email, password, role } : { email, password, role, address };

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong during authentication.');
      }

      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userRole', data.user.role || 'customer');
        setIsAuthenticated(true);
        setUserEmail(data.user.email);
        setUserRole(data.user.role || 'customer');
      } else {
        throw new Error('Authentication successful, but no token or user data received.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/google`;
  };

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRole('');
  };

  // Determine if the form is valid to enable/disable the submit button
  const isFormValid =
    emailError === '' &&
    passwordError === '' &&
    (isLogin || addressError === '') && // Include address error in validation for signup
    email !== '' &&
    password !== '' &&
    (isLogin || address !== ''); // Address required only for signup

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 text-center bg-white p-8 rounded-lg shadow-lg relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-inter">
            Welcome, {userEmail}!
          </h2>
          <p className="text-gray-600">Your role: <span className="font-semibold capitalize">{userRole}</span></p>
          <button
            onClick={handleSignOut}
            className="group relative flex w-full justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 relative z-10 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-inter">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-inter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            {/* Role selection now above email */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 font-inter">
                Role
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter"
                >
                  <option value="customer">Customer</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter"
                  placeholder="Email address"
                />
              </div>
              {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>

            {/* Address field for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="address" className="sr-only">
                  Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    required={!isLogin} // Make required only for signup
                    value={address}
                    onChange={handleAddressChange}
                    className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter"
                    placeholder="Your address"
                  />
                </div>
                {addressError && <p className="mt-2 text-sm text-red-600">{addressError}</p>}
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter"
                onClick={() => console.log('Forgot password clicked')}
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid && (email !== '' || password !== '' || (!isLogin && address !== ''))}
            className={`group relative flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              isFormValid || (email === '' && password === '' && (isLogin || address === ''))
                ? 'bg-sky-600 hover:bg-sky-500 focus-visible:ring-sky-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {isLogin ? (
                <LogIn className="h-5 w-5 text-sky-300 group-hover:text-sky-200" />
              ) : (
                <UserPlus className="h-5 w-5 text-sky-300 group-hover:text-sky-200" />
              )}
            </span>
            {isLogin ? 'Sign in' : 'Create account'}
            <ArrowRight className="ml-2 h-5 w-5 text-sky-300 group-hover:text-sky-200" />
          </button>
        </form>

        <p className="mt-2 text-sm text-gray-600 text-center font-inter">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 font-inter">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 font-inter"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;