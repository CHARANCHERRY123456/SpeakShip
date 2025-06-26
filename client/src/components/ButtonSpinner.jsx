// src/features/core/components/ButtonSpinner.jsx
import React from 'react';

/**
 * A reusable spinner component for buttons.
 * Uses Tailwind CSS for animation.
 * @param {object} props
 * @param {number} [props.size=20] - The size of the spinner in pixels (width and height).
 * @param {string} [props.color="currentColor"] - The color of the spinner.
 */
const ButtonSpinner = ({ size = 20, color = "currentColor" }) => {
  return (
    <div
      className="inline-block animate-spin rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${size / 8}px solid ${color}`, // Adjust border thickness based on size
        borderTopColor: 'transparent', // Creates the spinning effect
      }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default ButtonSpinner;