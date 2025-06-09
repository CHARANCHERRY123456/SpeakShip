import { useState } from 'react'; // No need for useEffect here anymore
import {
  validateEmail,
  validatePassword,
  validateUsername, // Ensure these new validators are imported
  validateName,
  validatePhone,
  // validateAddress // We won't use this for initial signup validity
} from '../utils';
import { useAuth } from '../../../contexts/AuthContext'; // Ensure this path is correct: ../../../contexts/AuthContext

export function useAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(''); // Keep for state, but not for initial signup validation
  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addressError, setAddressError] = useState(''); // This will likely remain empty for signup
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const { isAuthenticated, user, login, register, logout } = useAuth();

  // --- Google OAuth Handler Integration ---
  // Expose the correct Google handler for the form
  const handleGoogleSignIn = () => handleGoogleLogin(role, null, (err) => setError(err));

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
    // If address is NOT used for initial signup, you can simplify its error
    setAddressError(''); // Or only validate if you decide to re-add it to initial signup requirements
  };
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value)); // Add validation here
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // For login, allow username or email (just check not empty). For register, validate as username.
    if (isLogin) {
      setUsernameError(e.target.value ? '' : 'Username or Email is required.');
    } else {
      setUsernameError(validateUsername(e.target.value));
    }
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setPhoneError(validatePhone(e.target.value)); // Add validation here
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Trigger all relevant validations on submit
    const currentUsernameError = validateUsername(username);
    const currentPasswordError = validatePassword(password);
    const currentEmailError = !isLogin ? validateEmail(email) : ''; // Email only for register
    const currentNameError = !isLogin ? validateName(name) : ''; // Name only for register
    const currentPhoneError = !isLogin ? validatePhone(phone) : ''; // Phone only for register

    // Set errors to state
    setUsernameError(currentUsernameError);
    setPasswordError(currentPasswordError);
    setEmailError(currentEmailError);
    setNameError(currentNameError);
    setPhoneError(currentPhoneError);
    setAddressError(''); // Address is not required for initial signup, so clear any error

    // Check if any errors exist
    if (currentUsernameError || currentPasswordError || currentEmailError || currentNameError || currentPhoneError) {
      setError("Please correct the form errors.");
      return;
    }

    try {
        if (isLogin) {
            await login({ username, password, role });
        } else {
            // Ensure all required fields by backend are sent for registration
            await register({ username, name, email, password, phone, role });
        }
        // Success state handled by AuthContext (isAuthenticated will update)
    } catch (err) {
        setError(err.message); // Error from AuthContext's login/register functions
    }
  };

  // --- Google OAuth Popup Handler ---
  const handleGoogleLogin = (role = 'customer', onSuccess, onError) => {
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/google?role=${role}`,
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    function receiveMessage(event) {
      // Optionally check event.origin for security
      if (event.data && event.data.token) {
        localStorage.setItem('authToken', event.data.token);
        // Fetch user profile from backend
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${event.data.token}` }
        })
          .then(res => res.json())
          .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            if (onSuccess) onSuccess(user);
          })
          .catch(() => {
            if (onError) onError('Failed to fetch user profile.');
          });
        window.removeEventListener('message', receiveMessage);
        if (popup) popup.close();
      } else if (event.data && event.data.error) {
        if (onError) onError(event.data.error);
        window.removeEventListener('message', receiveMessage);
        if (popup) popup.close();
      }
    }
    window.addEventListener('message', receiveMessage);
  };

  const handleSignOut = () => {
    logout();
  };

  // REFINED isFormValid LOGIC
  const isFormValid = isLogin
    ? ( // Login form: requires username or email and password, both valid
        !usernameError && username &&
        !passwordError && password
      )
    : ( // Registration form: requires username, name, email, password, phone, all valid
        !usernameError && username &&
        !nameError && name &&
        !emailError && email &&
        !passwordError && password &&
        !phoneError && phone
      );

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
    userEmail: user?.email,
    userRole: user?.role,
    emailError,
    passwordError,
    addressError, // Will mostly be empty now for signup
    name,
    username,
    phone,
    nameError,
    usernameError,
    phoneError,
    handleEmailChange,
    handlePasswordChange,
    handleAddressChange,
    handleRoleChange,
    handleTogglePassword,
    handleNameChange,
    handleUsernameChange,
    handlePhoneChange,
    handleSubmit,
    handleGoogleSignIn,
    handleSignOut,
    isFormValid, // Now correctly reflects validity
  };
}