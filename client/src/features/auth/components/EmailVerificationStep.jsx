import React from 'react';
import { Mail, Key, RefreshCcw, CheckCircle } from 'lucide-react';
import OtpInput from './OtpInput';
import { motion } from 'framer-motion';

function EmailVerificationStep({
  email,
  emailError,
  handleEmailChange,
  isEmailVerified,
  otpSent,
  otp,
  otpError,
  handleOtpChange,
  otpResendTimer,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  isLoading,
}) {
  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">Email address</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter ${
                emailError ? 'border-red-500 focus:ring-red-500' : ''
              } ${isEmailVerified ? 'bg-green-50' : ''}`}
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              disabled={isEmailVerified || isLoading || otpSent}
            />
            {isEmailVerified && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
              </div>
            )}
          </div>
          {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
        </div>

        {/* Centered Verify Email Button */}
        {!otpSent && !isEmailVerified && email && !emailError && (
          <motion.button
            type="button"
            onClick={onSendOtp}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex justify-center items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                Verify Email
              </>
            )}
          </motion.button>
        )}

        {otpSent && !isEmailVerified && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 rounded-md"
          >
            <p className="text-center text-sm text-gray-600">
              A 6-digit OTP has been sent to <span className="font-semibold text-blue-600">{email}</span>
            </p>
            
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              error={otpError}
              disabled={isLoading}
            />
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
              {otpResendTimer > 0 ? (
                <span className="text-sm text-gray-500">Resend in {otpResendTimer}s</span>
              ) : (
                <motion.button
                  type="button"
                  onClick={onResendOtp}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-inter flex items-center gap-1"
                >
                  <RefreshCcw className="h-4 w-4" /> 
                  Resend OTP
                </motion.button>
              )}
              
              <motion.button
                type="button"
                onClick={onVerifyOtp}
                disabled={isLoading || !otp || otp.length !== 6 || otpError}
                whileHover={(!isLoading && otp?.length === 6 && !otpError) ? { scale: 1.05 } : {}}
                whileTap={(!isLoading && otp?.length === 6 && !otpError) ? { scale: 0.95 } : {}}
                className={`w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  isLoading || !otp || otp.length !== 6 || otpError 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default EmailVerificationStep;