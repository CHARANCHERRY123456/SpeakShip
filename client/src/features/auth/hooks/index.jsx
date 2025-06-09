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

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked! (Backend integration pending)");
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