import { useState } from 'react'; // No need for useEffect here anymore
import {
  validateEmail,
  validatePassword,
  validateUsername, // Ensure these new validators are imported
  validateName,
  validatePhone,
} from '../utils';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

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
  const [password, setPassword] = useState(defaultPassword);
  const [address, setAddress] = useState(''); // Keep for state, but not for initial signup validation
  const [role, setRole] = useState(defaultRole); // No default role
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(defaultName);
  const [username, setUsername] = useState(defaultUsername);
  const [phone, setPhone] = useState(defaultPhone);

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
  const handleGoogleSignIn = () => {
    if (!role || !['customer', 'driver', 'admin'].includes(role)) {
      setError('Please select a valid role before logging in.');
      return;
    }
    handleGoogleLogin(role, null, (err) => setError(err));
  };

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

    // In handleSubmit, add role validation
    if (!role || !['customer', 'driver', 'admin'].includes(role)) {
      setError('Please select a valid role.');
      return;
    }

    try {
        if (isLogin) {
            await login({ username, password, role });
            toast.success('Welcome back!');
        } else {
            // Ensure all required fields by backend are sent for registration
            await register({ username, name, email, password, phone, role });
            toast.success('Registration successful! You can now explore the website');
        }
        // Success state handled by AuthContext (isAuthenticated will update)
    } catch (err) {
        setError(err.message); // Error from AuthContext's login/register functions
    }
  };

  // --- Google OAuth Popup Handler ---
  const handleGoogleLogin = (role, onSuccess, onError) => {
    if (!role || !['customer', 'driver', 'admin'].includes(role)) {
      showResultModal(false, 'Please select a valid role before logging in.');
      if (onError) onError('Please select a valid role before logging in.');
      return;
    }

    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/auth/google?role=${role}`,
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    function showResultModal(success, userOrMsg) {
      // Remove any existing modal
      const oldModal = document.getElementById('login-result-modal');
      if (oldModal) oldModal.remove();
      // Create modal
      const modal = document.createElement('div');
      modal.id = 'login-result-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.3)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';
      modal.innerHTML = success
        ? `<div style='background:#fff;padding:2rem 2.5rem;border-radius:12px;box-shadow:0 4px 24px #0002;text-align:center;min-width:300px;'>
            <h2 style='color:#16a34a;font-size:1.5rem;margin-bottom:0.5rem;'>Login Successful!</h2>
            <div style='margin-bottom:1rem;'>Welcome, <b>${userOrMsg.name || userOrMsg.email || userOrMsg.username}</b><br/>Role: <b>${userOrMsg.role}</b></div>
            <button id='close-login-modal' style='background:#16a34a;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-size:1rem;cursor:pointer;'>OK</button>
          </div>`
        : `<div style='background:#fff;padding:2rem 2.5rem;border-radius:12px;box-shadow:0 4px 24px #0002;text-align:center;min-width:300px;'>
            <h2 style='color:#dc2626;font-size:1.5rem;margin-bottom:0.5rem;'>Login Failed</h2>
            <div style='margin-bottom:1rem;'>${userOrMsg}</div>
            <button id='close-login-modal' style='background:#dc2626;color:#fff;padding:0.5rem 1.5rem;border:none;border-radius:6px;font-size:1rem;cursor:pointer;'>Close</button>
          </div>`;
      document.body.appendChild(modal);
      document.getElementById('close-login-modal').onclick = () => {
        modal.remove();
        if (success) window.location.reload();
      };
    }

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
            if (!user || !user.role) {
              showResultModal(false, 'You are not logged in or not authorized.');
              if (onError) onError('You are not logged in or not authorized.');
              return;
            }
            localStorage.setItem('user', JSON.stringify(user));
            showResultModal(true, user);
            if (onSuccess) onSuccess(user);
          })
          .catch(() => {
            showResultModal(false, 'Failed to fetch user profile.');
            if (onError) onError('Failed to fetch user profile.');
          });
        window.removeEventListener('message', receiveMessage);
        if (popup) popup.close();
      } else if (event.data && event.data.error) {
        showResultModal(false, event.data.error);
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