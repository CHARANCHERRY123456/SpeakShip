import React from 'react';

const OtpModal = ({ show, otpInput, setOtpInput, otpLoading, otpError, onClose, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full p-6 transition-all duration-300" role="dialog" aria-modal="true">
        <h3 className="text-xl font-bold mb-2 text-center">🔐 Enter Delivery OTP</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">Ask the customer for the 6-digit OTP sent to their email/phone. Enter it below to complete the delivery.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="\\d*"
            maxLength={6}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg font-mono"
            placeholder="Enter 6-digit OTP"
            value={otpInput}
            onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
            required
            disabled={otpLoading}
            autoFocus
            aria-label="Delivery OTP"
          />

          {otpError && <p className="text-red-500 text-sm text-center">{otpError}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={otpLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={otpLoading || otpInput.length !== 6}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-60"
            >
              {otpLoading ? 'Verifying...' : 'Verify & Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
