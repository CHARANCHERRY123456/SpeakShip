import React from 'react';

const OtpModal = ({ show, otpInput, setOtpInput, otpLoading, otpError, onClose, onSubmit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl max-w-md w-full p-6 transition-all duration-300">
        <h3 className="text-xl font-bold mb-4 text-center">🔐 Enter Delivery OTP</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter 6-digit OTP"
            value={otpInput}
            onChange={e => setOtpInput(e.target.value)}
            required
            disabled={otpLoading}
          />

          {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={otpLoading}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-60"
            >
              {otpLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
