import React from 'react';
import { useTranslation } from '../../lang/translationHelper';
import './LoadingIndicator.css';

/**
 * LoadingIndicator Component
 *
 * A reusable loading indicator that can be used across the application
 * with customizable message, size, and overlay options.
 *
 * @param {Object} props Component props
 * @param {boolean} props.isLoading Whether the content is currently loading
 * @param {string} props.message Custom loading message (optional)
 * @param {string} props.translationKey Translation key for the loading message (optional)
 * @param {string} props.size Size of the spinner ('sm', 'md', 'lg')
 * @param {boolean} props.overlay Whether to show the loading indicator as an overlay
 * @param {React.ReactNode} props.children Content to display when not loading
 * @returns {JSX.Element} Loading indicator or children
 */
const LoadingIndicator = ({
  isLoading,
  message,
  translationKey = 'common.loading',
  size = 'md',
  overlay = false,
  children
}) => {
  const { t } = useTranslation();

  // If not loading, render children
  if (!isLoading) {
    return children || null;
  }

  // Determine the container class based on overlay prop
  const containerClass = overlay ? 'loading-overlay' : 'loading-container';

  // Determine size class
  const sizeClass = `spinner-${size}`;

  // We're not displaying any text message, only the spinner
  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingIndicator;
