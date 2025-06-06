import React from 'react';
import {
  RoleSelect,
  EmailInput,
  PasswordInput,
  AddressInput,
  ErrorAlert,
  GoogleButton,
  AuthenticatedView,
} from '../components';
import { useAuthForm } from '../hooks';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

function AuthPage() {
  const {
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
  } = useAuthForm();

  if (isAuthenticated) {
    return (
      <AuthenticatedView userEmail={userEmail} userRole={userRole} onSignOut={handleSignOut} />
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
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            <RoleSelect value={role} onChange={handleRoleChange} />
            <EmailInput value={email} onChange={handleEmailChange} error={emailError} />
            <PasswordInput
              value={password}
              onChange={handlePasswordChange}
              error={passwordError}
              show={showPassword}
              onToggle={handleTogglePassword}
            />
            {!isLogin && (
              <AddressInput value={address} onChange={handleAddressChange} error={addressError} />
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
          <GoogleButton onClick={handleGoogleSignIn} />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;