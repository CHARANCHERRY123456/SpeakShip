// client/src/features/auth/pages/index.jsx
import {
  RoleSelect,
  EmailVerificationStep,
  PasswordInput,
  ErrorAlert,
  GoogleButton,
  AuthenticatedView,
  UsernameInput,
  NameInput,
  PhoneInput,
} from '../components';
import { useAuthForm } from '../hooks';
import { LogIn, UserPlus, ArrowRight } from 'lucide-react';

function AuthPage() {
  const {
    isLogin,
    setIsLogin, // This is now handleAuthSwitch from useAuthForm
    username,
    email,
    password,
    role,
    showPassword,
    error,
    isAuthenticated,
    userEmail,
    userRole,
    name,
    phone,

    // Errors
    usernameError,
    emailError,
    passwordError,
    nameError,
    phoneError,
    otpError,

    // Email verification specific states and handlers
    otp,
    otpSent,
    isEmailVerified,
    otpResendTimer,
    isSendingOtp,
    isVerifyingOtp,

    handleEmailChange,
    handlePasswordChange,
    handleRoleChange,
    handleTogglePassword,
    handleNameChange,
    handleUsernameChange,
    handlePhoneChange,
    handleOtpChange,

    handleSendOtp,
    handleVerifyOtp,
    handleResendOtp,

    handleSubmit,
    handleGoogleSignIn,
    handleSignOut,
    isFormValid,
  } = useAuthForm({
    defaultUsername: '',
    defaultName: '',
    defaultEmail: '',
    defaultPhone: '',
    defaultPassword: '',
    defaultRole: 'customer',
  });

  if (isAuthenticated) {
    return (
      <AuthenticatedView userEmail={userEmail} userRole={userRole} onSignOut={handleSignOut} />
    );
  }

  // Determine if we are currently on the email verification phase for signup
  const isEmailVerificationPhase = !isLogin && !isEmailVerified;
  // Determine if we are on the main signup form (after email verified)
  const isFullSignupPhase = !isLogin && isEmailVerified;


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 relative z-10 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-inter">
            {isEmailVerificationPhase
              ? 'Verify your email to create account'
              : (isLogin ? 'Welcome back' : 'Create your account')}
          </h2>
        </div>
        <ErrorAlert error={error} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            <RoleSelect
              value={role}
              onChange={handleRoleChange}
              isLogin={isLogin}
              disabled={isEmailVerificationPhase || isFullSignupPhase}
            />

            {/* Email Verification Step for Signup */}
            {!isLogin && (
              <EmailVerificationStep
                email={email}
                emailError={emailError}
                handleEmailChange={handleEmailChange}
                isEmailVerified={isEmailVerified}
                otpSent={otpSent}
                otp={otp}
                otpError={otpError}
                handleOtpChange={handleOtpChange}
                otpResendTimer={otpResendTimer}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                isLoading={isSendingOtp || isVerifyingOtp}
              />
            )}

            {/* Main Signup/Login fields - Conditional rendering */}
            {(isLogin || isFullSignupPhase) && (
              <>
                {/* Username or Email Input - for login and registration */}
                <UsernameInput
                  value={username}
                  onChange={handleUsernameChange}
                  error={usernameError}
                  label={isLogin ? 'Username or Email' : 'Username'}
                  placeholder={isLogin ? 'Username or Email' : 'Username'}
                  disabled={isEmailVerificationPhase}
                />

                {/* Fields only for Registration, shown after email is verified */}
                {isFullSignupPhase && (
                  <>
                    <NameInput
                      value={name}
                      onChange={handleNameChange}
                      error={nameError}
                      placeholder="Full Name"
                      disabled={isEmailVerificationPhase}
                    />
                    <PhoneInput
                      value={phone}
                      onChange={handlePhoneChange}
                      error={phoneError}
                      placeholder="Phone Number"
                      disabled={isEmailVerificationPhase}
                    />
                  </>
                )}

                <PasswordInput
                  value={password}
                  onChange={handlePasswordChange}
                  error={passwordError}
                  show={showPassword}
                  onToggle={handleTogglePassword}
                  placeholder="Password"
                  disabled={isEmailVerificationPhase}
                />
              </>
            )}

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
          </div>

          {/* Main Submit Button - Only visible for login or after email verification for signup */}
          {(isLogin || isFullSignupPhase) && (
            <button
              type="submit"
              disabled={!isFormValid}
              className={`group relative flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isFormValid
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
          )}
        </form>

        {/* Switch Login/Signup Link */}
        <p className="mt-2 text-sm text-gray-600 text-center font-inter">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin()} // Corrected line
            className="font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Or continue with divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 font-inter">Or continue with</span>
          </div>
        </div>

        {/* Only show Google login on login form */}
        {isLogin && (
          <div className="grid grid-cols-1 gap-4">
            <GoogleButton onClick={handleGoogleSignIn} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthPage;