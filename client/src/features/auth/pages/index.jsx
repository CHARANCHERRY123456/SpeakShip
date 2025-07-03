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
import { motion } from 'framer-motion';

function AuthPage() {
  const {
    isLogin,
    setIsLogin,
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
    usernameError,
    emailError,
    passwordError,
    nameError,
    phoneError,
    otpError,
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

  const isEmailVerificationPhase = !isLogin && !isEmailVerified;
  const isFullSignupPhase = !isLogin && isEmailVerified;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Gradient border */}
        {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div> */}
        
        {/* Main card */}
        <div className="relative bg-white rounded-lg shadow-xl border border-blue-100 overflow-hidden">
          {/* Animated top accent border */}
          <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 w-full"></div>
          
          <div className="p-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-inter">
                {isEmailVerificationPhase
                  ? 'Verify Your Email '
                  : (isLogin ? 'Welcome back' : 'Create Your Account')}
              </h2>
            </motion.div>

            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4 rounded-md">
                <RoleSelect
                  value={role}
                  onChange={handleRoleChange}
                  isLogin={isLogin}
                  disabled={isEmailVerificationPhase || isFullSignupPhase}
                />

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

                {(isLogin || isFullSignupPhase) && (
                  <>
                    <UsernameInput
                      value={username}
                      onChange={handleUsernameChange}
                      error={usernameError}
                      label={isLogin ? 'Username or Email' : 'Username'}
                      placeholder={isLogin ? 'Username or Email' : 'Username'}
                      disabled={isEmailVerificationPhase}
                    />

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
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="text-sm font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter transition-colors duration-200"
                      onClick={() => console.log('Forgot password clicked')}
                    >
                      Forgot your password?
                    </motion.button>
                  </div>
                )}
              </div>

              {(isLogin || isFullSignupPhase) && (
                <motion.button
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={!isFormValid}
                  className={`group relative flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 ${
                    isFormValid
                      ? 'bg-sky-600 hover:bg-sky-500 focus-visible:ring-sky-500 shadow-md hover:shadow-lg'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    {isLogin ? (
                      <LogIn className="h-5 w-5 text-sky-300 group-hover:text-sky-200 transition-colors duration-300" />
                    ) : (
                      <UserPlus className="h-5 w-5 text-sky-300 group-hover:text-sky-200 transition-colors duration-300" />
                    )}
                  </span>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="ml-2 h-5 w-5 text-sky-300 group-hover:text-sky-200 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              )}
            </form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-600 text-center font-inter"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLogin()}
                className="font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </motion.button>
            </motion.p>

            {(isLogin || isEmailVerificationPhase) && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative mt-6"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500 font-inter">Or continue with</span>
                  </div>
                </motion.div>

                {isLogin && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <GoogleButton onClick={handleGoogleSignIn} />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;