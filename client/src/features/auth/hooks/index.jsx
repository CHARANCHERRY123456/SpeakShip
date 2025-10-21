// client/src/features/auth/hooks/index.jsx
import { useState, useEffect } from 'react';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
  validatePhone,
  validateOtp
} from '../utils'; 
import { useAuth } from '../../../contexts/AuthContext'; 
import { toast } from 'react-hot-toast';
import { verifyEmailOtp, resendEmailOtp, sendEmailOtpBackend } from '../api';

export function useAuthForm({
  defaultUsername = '',
  defaultName = '',
  defaultEmail = '',
  defaultPhone = '',
  defaultPassword = '',
  defaultRole = 'customer',
} = {}) {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState(defaultEmail);
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [username, setUsername] = useState(defaultUsername);
  const [name, setName] = useState(defaultName);
  const [password, setPassword] = useState(defaultPassword);
  const [phone, setPhone] = useState(defaultPhone);
  const [role, setRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const { isAuthenticated, user, login, register, logout, handleGoogleLogin } = useAuth(); // Assume handleGoogleLogin is from AuthContext

  useEffect(() => {
    let timerInterval;
    if (otpSent && otpResendTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpResendTimer(prev => prev - 1);
      }, 1000);
    } else if (otpResendTimer === 0 && otpSent) {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [otpSent, otpResendTimer]);

  const startOtpResendTimer = () => {
    setOtpResendTimer(60);
  };

  const handleAuthSwitch = () => {
    setIsLogin(prev => !prev);
    setEmail(defaultEmail);
    setUsername(defaultUsername);
    setName(defaultName);
    setPassword(defaultPassword);
    setPhone(defaultPhone);
    setOtp('');
    setOtpSent(false);
    setIsEmailVerified(false);
    setOtpResendTimer(0);
    setError(null);
    setEmailError('');
    setUsernameError('');
    setNameError('');
    setPasswordError('');
    setPhoneError('');
    setOtpError('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
    if (otpSent || isEmailVerified) {
      setOtpSent(false);
      setIsEmailVerified(false);
      setOtp('');
      setOtpError('');
      setOtpResendTimer(0);
      setError(null);
    }
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError(validateUsername(e.target.value));
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setPhoneError(validatePhone(e.target.value));
  };
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (e.target.value.length === 6) {
      setOtpError(validateOtp(e.target.value));
    } else {
      setOtpError('');
    }
  };

  const handleSendOtp = async () => {
    setError(null);
    const currentEmailError = validateEmail(email);
    setEmailError(currentEmailError);
    if (currentEmailError) {
      setError("Please enter a valid email address to send OTP.");
      return;
    }
    if (!role || !['customer', 'driver'].includes(role)) { // Only customer/driver need OTP verification via this flow
        setError('Please select a valid role (Customer or Driver) for verification.');
        return;
    }

    setIsSendingOtp(true);
    try {
      const response = await sendEmailOtpBackend(email, role);
      toast.success(response.message);
      setOtpSent(true);
      startOtpResendTimer();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    const currentOtpError = validateOtp(otp);
    setOtpError(currentOtpError);
    if (currentOtpError) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await verifyEmailOtp(email, otp, role); // Make sure this API call exists
      toast.success(response.message); // e.g., "Email successfully verified."
      setIsEmailVerified(true);
      setOtpSent(false); // Hide OTP input after success
      setOtpResendTimer(0); // Stop timer
      setOtp(''); // Clear OTP field
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'OTP verification failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setOtpError('');
    if (otpResendTimer > 0) return; // Prevent resend if timer is active

    setIsSendingOtp(true); // Re-use this for resend button loading
    try {
      // Calls the backend endpoint to resend OTP
      const response = await resendEmailOtp(email, role); // Make sure this API call exists
      toast.success(response.message); // "New OTP sent to your email."
      startOtpResendTimer(); // Restart timer
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to resend OTP.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };


  // Main form submission (for login or *after* email verification for signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // If it's a login form
    if (isLogin) {
      const currentUsernameError = username ? '' : 'Username or Email is required.';
      const currentPasswordError = validatePassword(password);
      setUsernameError(currentUsernameError);
      setPasswordError(currentPasswordError);

      if (currentUsernameError || currentPasswordError) {
        setError("Please correct the form errors.");
        return;
      }
      try {
        await login({ username, password, role });
        toast.success('Welcome back!');
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        setError(errorMessage);
        toast.error(errorMessage);
        // If login failed due to unverified account, prompt for verification
        if (err.response?.data?.requiresVerification && err.response?.data?.email) {
            setEmail(err.response.data.email); // Set email for OTP step
            setRole(err.response.data.role); // Set role from backend response if available
            setIsLogin(false); // Switch to signup flow (verification part)
            setOtpSent(false); // Ensure OTP input is shown if needed
            setIsEmailVerified(false); // Make sure it's not marked as verified
            setError("Your account is not verified. Please verify your email to log in.");
            toast.info("Your account is not verified. Please verify your email to log in.");
        }
      }
    }
    // If it's a signup form AND email is verified
    else if (!isLogin && isEmailVerified) {
      const currentUsernameError = validateUsername(username);
      const currentNameError = validateName(name);
      const currentPasswordError = validatePassword(password);
      const currentPhoneError = validatePhone(phone);

      setUsernameError(currentUsernameError);
      setNameError(currentNameError);
      setPasswordError(currentPasswordError);
      setPhoneError(currentPhoneError);

      if (currentUsernameError || currentNameError || currentPasswordError || currentPhoneError) {
        setError("Please correct the form errors.");
        return;
      }
      try {
        // Here, the backend register function should *not* send OTP, as email is already verified.
        // It will receive isVerified: true from the frontend and save it.
        await register({ username, name, email, password, phone, role });
        toast.success('Registration successful! You can now log in.');
        setIsLogin(true); // Go back to login form after successful registration
        // Clear all fields for new login
        setEmail(defaultEmail); setUsername(defaultUsername); setName(defaultName);
        setPassword(defaultPassword); setPhone(defaultPhone); setOtp('');
        setOtpSent(false); setIsEmailVerified(false); setOtpResendTimer(0);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message;
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } else {
        // This case should ideally not be reached if the UI enforces steps
        setError("Please complete the email verification first.");
    }
  };

  const handleSignOut = () => {
    logout();
  };

  // Determine if the main signup button should be enabled
  const isSignupFormReady = !isLogin && isEmailVerified &&
    !usernameError && username &&
    !nameError && name &&
    !passwordError && password &&
    !phoneError && phone;

  // Determine if the login form button should be enabled
  const isLoginFormReady = isLogin &&
    !usernameError && username &&
    !passwordError && password;

  const isFormValid = isLogin ? isLoginFormReady : isSignupFormReady; // Only enable signup if email is verified and other fields are valid

  return {
    isLogin,
    setIsLogin: handleAuthSwitch, // Use the new handler to reset states properly
    email,
    password,
    role,
    showPassword,
    error,
    isAuthenticated,
    userEmail: user?.email,
    userRole: user?.role,
    name,
    username,
    phone,
    nameError,
    usernameError,
    phoneError,

    // OTP and email verification states/handlers
    otp,
    otpError,
    otpSent,
    isEmailVerified,
    otpResendTimer,
    isSendingOtp, // Loading state for "Send OTP" and "Resend OTP"
    isVerifyingOtp, // Loading state for "Verify OTP"

    handleEmailChange,
    handlePasswordChange,
    handleRoleChange,
    handleTogglePassword,
    handleNameChange,
    handleUsernameChange,
    handlePhoneChange,
    handleOtpChange, // For OTP input

    handleSendOtp, // For "Verify Email" button
    handleVerifyOtp, // For "Verify OTP" button
    handleResendOtp, // For "Resend OTP" button

    handleSubmit, // For final signup/login submit
    handleGoogleSignIn: () => handleGoogleLogin(role, null, (err) => setError(err)), // Pass role to Google login
    handleSignOut,
    isFormValid,
  };
}