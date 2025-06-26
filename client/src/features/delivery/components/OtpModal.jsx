// src/features/delivery/components/OtpModal.jsx
import React from 'react';
import LoadingButton from '../../../components/LoadingButton';

const OtpModal = ({ show, otpInput, setOtpInput, otpLoading, otpError, onClose, onSubmit, delivery }) => {
    if (!show) return null;

    // Defensive: fallback for delivery
    const customerEmail = delivery?.email || delivery?.customer?.email || 'customer';
    const productName = delivery?.packageName || 'the package';

    return (
        // Changed from fixed full-screen to absolute positioning within the card
        // Added bg-black/80 for a dark overlay effect directly on the card
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80 rounded-2xl p-4">
            <div className="bg-[#151c28] dark:bg-gray-900 text-gray-100 rounded-xl shadow-lg w-full max-w-sm p-4 transition-all duration-300 flex flex-col items-center" role="dialog" aria-modal="true">
                <div className="mb-3 text-center">
                    <div className="text-green-400 text-xl mb-1 font-bold">OTP Sent!</div>
                    <div className="text-xs text-gray-200 mb-1">
                        An OTP has been sent to <span className="font-semibold">{customerEmail}</span> for <span className="font-semibold">{productName}</span>.
                    </div>
                    <div className="text-xs text-gray-400">Ask the customer for the 6-digit OTP.</div>
                </div>
                <form onSubmit={onSubmit} className="space-y-3 w-full">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-base font-mono transition-all duration-200"
                        placeholder="Enter OTP"
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        disabled={otpLoading}
                        autoFocus
                        aria-label="Delivery OTP"
                        style={{ letterSpacing: '0.2em', backgroundClip: 'padding-box' }}
                    />

                    {otpError && <p className="text-red-500 text-xs text-center animate-pulse">{otpError}</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors text-sm"
                            disabled={otpLoading}
                        >
                            Cancel
                        </button>

                        <LoadingButton
                            type="submit"
                            loading={otpLoading}
                            loadingText="Verifying..."
                            className="px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-60 text-sm"
                            disabled={otpInput.length !== 6}
                        >
                            Verify
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OtpModal;