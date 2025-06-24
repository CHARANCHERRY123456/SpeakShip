// src/components/LoadingButton.jsx
import React from 'react';
import ButtonSpinner from '../features/core/components/ButtonSpinner';

/**
 * DRY LoadingButton for all async actions.
 * @param {object} props
 * @param {boolean} props.loading - Whether to show spinner and disable button
 * @param {string} [props.loadingText] - Text to show when loading (optional)
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Button text/content
 * @param {any} rest - Other button props (onClick, type, etc)
 */
const LoadingButton = ({
  loading,
  loadingText,
  className = '',
  children,
  ...rest
}) => (
  <button
    className={`relative flex items-center justify-center transition-opacity disabled:opacity-60 ${className}`}
    disabled={loading || rest.disabled}
    {...rest}
  >
    {loading && <ButtonSpinner size={18} color="#fff" />}
    {loading ? (loadingText || children) : children}
  </button>
);

export default LoadingButton;
