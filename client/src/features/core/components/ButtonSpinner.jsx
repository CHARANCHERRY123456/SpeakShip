// features/core/components/ButtonSpinner.jsx
import React from 'react';

const ButtonSpinner = ({ size = 20, color = '#fff' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 50 50"
    className="inline-block animate-spin align-middle mr-2"
    style={{ verticalAlign: 'middle' }}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeDasharray="31.4 31.4"
      strokeLinecap="round"
      opacity="0.6"
    />
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke={color}
      strokeWidth="5"
      strokeDasharray="31.4 31.4"
      strokeDashoffset="15.7"
      strokeLinecap="round"
    />
  </svg>
);

export default ButtonSpinner;
