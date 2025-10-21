import { Lock, Eye, EyeOff, User,Users,UserCircle, MapPin, Tag, Phone } from 'lucide-react';
import { USER_ROLES } from '../../../constants/globalConstants';

import OtpInput from './OtpInput';
import EmailVerificationStep from './EmailVerificationStep';

function RoleSelect({ value, onChange, isLogin, disabled }) {
  return (
    <div className="mb-2">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <User className="h-5 w-5 text-gray-400" /> 
        </div>
        <select
  id="role"
  name="role"
  value={value}
  onChange={onChange}
  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter appearance-none"
  style={{ marginBottom: 0 }}
  disabled={disabled}
>
  <option value="" disabled selected hidden>Select Role</option>
  <option value={USER_ROLES.CUSTOMER}>Customer</option>
  <option value={USER_ROLES.DRIVER}>Driver</option>
  {isLogin && <option value={USER_ROLES.ADMIN}>Admin</option>}
</select>

<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</div>
      </div>
    </div>
  );
}

function UsernameInput({ value, onChange, error, label = 'Username', placeholder = 'Username', disabled }) {
  return (
    <div>
      <label htmlFor="username" className="sr-only">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <UserCircle className="h-5 w-5 text-gray-400"  aria-hidden="true" />
        </div>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
          required
          className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function PasswordInput({ value, onChange, error, show, onToggle, placeholder = 'Password', disabled }) {
  return (
    <div>
      <label htmlFor="password" className="sr-only">{placeholder}</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="password"
          name="password"
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={value}
          onChange={onChange}
          className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
          disabled={disabled}
        >
          {show ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function NameInput({ value, onChange, error, disabled }) {
  return (
    <div>
      <label htmlFor="name" className="sr-only">Full Name</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Tag className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          name="name"
          id="name"
          autoComplete="name"
          required
          className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Full Name"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function PhoneInput({ value, onChange, error, disabled }) {
  return (
    <div>
      <label htmlFor="phone" className="sr-only">Phone Number</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="tel"
          name="phone"
          id="phone"
          autoComplete="tel"
          required
          className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Phone Number (e.g., 1234567890)"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function AddressInput({ value, onChange, error, disabled }) {
  return (
    <div>
      <label htmlFor="address" className="sr-only">Address</label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="address"
          name="address"
          type="text"
          autoComplete="street-address"
          required
          value={value}
          onChange={onChange}
          className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Your address"
          disabled={disabled}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function ErrorAlert({ error }) {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-inter">{error}</div>
  );
}

function GoogleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 font-inter"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
}

function AuthenticatedView({ userEmail, userRole, onSignOut }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 text-center bg-white p-8 rounded-lg shadow-lg relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-inter">
          Welcome, {userEmail}!
        </h2>
        <p className="text-gray-600">Your role: <span className="font-semibold capitalize">{userRole}</span></p>
        <button
          onClick={onSignOut}
          className="group relative flex w-full justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

// --- ALL EXPORTS ARE NOW HERE ---
export {
  RoleSelect,
  UsernameInput,
  PasswordInput,
  NameInput,
  PhoneInput,
  AddressInput,
  ErrorAlert,
  GoogleButton,
  AuthenticatedView,
  OtpInput,
  EmailVerificationStep,
};