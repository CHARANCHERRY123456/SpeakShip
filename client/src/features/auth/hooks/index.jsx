import { useState, useEffect } from 'react';
import { login, register, googleSignIn } from '../api';
import { validateEmail, validatePassword, validateAddress } from '../utils';

export function useAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');

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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setAddressError(validateAddress(e.target.value, isLogin));
  };
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const addressErr = isLogin ? '' : validateAddress(address, isLogin);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setAddressError(addressErr);
    if (emailErr || passwordErr || addressErr) return;
    try {
      const data = isLogin
        ? await login({ email, password, role })
        : await register({ email, password, role, address });
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

  const handleGoogleSignIn = () => googleSignIn();
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserRole('');
  };

  const isFormValid =
    !emailError &&
    !passwordError &&
    (isLogin || !addressError) &&
    email &&
    password &&
    (isLogin || address);

  return {
    isLogin,
    setIsLogin,
    email,
    password,
    address,
    role,
    showPassword,
    error,
    isAuthenticated,
    userEmail,
    userRole,
    emailError,
    passwordError,
    addressError,
    handleEmailChange,
    handlePasswordChange,
    handleAddressChange,
    handleRoleChange,
    handleTogglePassword,
    handleSubmit,
    handleGoogleSignIn,
    handleSignOut,
    isFormValid,
  };
}
