// client/src/features/auth/components/OtpInput.jsx
import React from 'react';

function OtpInput({ value, onChange, error, disabled }) {
  const handleChange = (e) => {
    // Only allow digits and limit length to 6
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange({ target: { value: val } }); // Pass the event object structure
  };

  return (
    <div>
      <label htmlFor="otp" className="sr-only">OTP</label>
      <div className="relative">
        <input
          id="otp"
          name="otp"
          type="text" // Use text to allow controlled input for number filtering
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          required
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full rounded-lg border border-gray-300 py-3 px-4 text-center text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm font-inter tracking-widest ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="Enter OTP"
          maxLength="6"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
}

export default OtpInput;