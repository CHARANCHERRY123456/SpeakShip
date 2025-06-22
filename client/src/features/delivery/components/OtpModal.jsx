import React from 'react';

const OtpModal = ({ show, otpInput, setOtpInput, otpLoading, otpError, onClose, onSubmit }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Enter Delivery OTP</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="w-full mb-4 p-2 border rounded-lg"
            placeholder="Enter OTP"
            value={otpInput}
            onChange={e => setOtpInput(e.target.value)}
            required
            disabled={otpLoading}
          />
          {otpError && <p className="text-red-600 text-sm mb-2">{otpError}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" disabled={otpLoading}>
              {otpLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
