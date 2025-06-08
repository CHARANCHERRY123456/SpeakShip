import React from 'react';
import { Phone } from 'lucide-react'; // Or an appropriate icon for phone

const PhoneInput = ({ value, onChange, error }) => (
  <div>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="tel" // Use type="tel" for phone numbers
        name="phone"
        id="phone"
        autoComplete="tel"
        required
        className={`block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ${
          error ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 focus:ring-sky-600'
        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
        placeholder="Phone Number (e.g., 1234567890)"
        value={value}
        onChange={onChange}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default PhoneInput;