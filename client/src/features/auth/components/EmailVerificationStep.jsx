// client/src/features/auth/components/EmailVerificationStep.jsx
import React from 'react';
import { Mail, Key, RefreshCcw, CheckCircle } from 'lucide-react';
import OtpInput from './OtpInput'; // Import OtpInput directly

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
          {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}

          {/* "Verify Email" button */}
          {!otpSent && !isEmailVerified && !emailError && email && (
            <button
              type="button"
              onClick={onSendOtp}
              disabled={isLoading || emailError || !email}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter"
            >
              {isLoading ? 'Sending...' : 'Verify Email'}
            </button>
          )}

          {isEmailVerified && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {otpSent && !isEmailVerified && (
        <div className="space-y-4 rounded-md">
          <p className="text-center text-sm text-gray-600">
            A 6-digit OTP has been sent to <b>{email}</b>. Please enter it below.
          </p>
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            error={otpError}
            disabled={isLoading}
          />
          <div className="text-center mt-2 flex justify-between items-center px-2">
            {otpResendTimer > 0 ? (
              <span className="text-sm text-gray-500">Resend in {otpResendTimer}s</span>
            ) : (
              <button
                type="button"
                onClick={onResendOtp}
                disabled={isLoading}
                className="text-sm font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 font-inter flex items-center"
              >
                <RefreshCcw className="h-4 w-4 mr-1" /> Resend OTP
              </button>
            )}
            <button
              type="button"
              onClick={onVerifyOtp}
              disabled={isLoading || !otp || otp.length !== 6 || otpError}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isLoading || !otp || otp.length !== 6 || otpError ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500'}`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default EmailVerificationStep;