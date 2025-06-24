import React from 'react';

const OtpModal = ({ show, otpInput, setOtpInput, otpLoading, otpError, onClose, onSubmit, delivery }) => {
  if (!show) return null;

  // Defensive: fallback for delivery
  const customerEmail = delivery?.email || delivery?.customer?.email || 'customer';
  const productName = delivery?.packageName || 'the package';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#151c28] dark:bg-gray-900 text-gray-100 rounded-2xl shadow-2xl max-w-md w-full p-8 transition-all duration-300 flex flex-col items-center" role="dialog" aria-modal="true">
        <div className="mb-4 text-center">
          <div className="text-green-400 text-2xl mb-2 font-bold">OTP Sent!</div>
          <div className="text-sm text-gray-200 mb-1">
            An OTP has been sent to <span className="font-semibold">{customerEmail}</span> for <span className="font-semibold">{productName}</span>.
          </div>
          <div className="text-xs text-gray-400 mb-2">Ask the customer for the 6-digit OTP and enter it below to complete the delivery.</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 w-full">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg font-mono transition-all duration-200"
            placeholder="Enter 6-digit OTP"
            value={otpInput}
            onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
            required
            disabled={otpLoading}
            autoFocus
            aria-label="Delivery OTP"
            style={{ letterSpacing: '0.3em', backgroundClip: 'padding-box' }}
          />

          {otpError && <p className="text-red-500 text-sm text-center animate-pulse">{otpError}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
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
