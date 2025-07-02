
import React from 'react';
import { useTranslation } from '../../lang/translationHelper';

/**
 * Chart Loading Indicator Component
 *
 * A consistent loading indicator for chart components with animation and text
 *
 * @param {Object} props Component props
 * @param {boolean} props.isLoading Whether the chart is currently loading
 * @param {string} props.message Custom loading message (optional)
 * @param {string} props.size Size of the spinner ('sm', 'md', 'lg')
 * @param {React.ReactNode} props.children Content to display when not loading
 * @returns {JSX.Element} Loading indicator or children
 */
const ChartLoadingIndicator = ({
  isLoading,
  message,
  size = 'md',
  children
}) => {
  const { t } = useTranslation();

  // Size mappings
  const sizeMap = {
    xs: {
      container: 'min-h-[120px]',
      spinner: 'w-5 h-5 border-2',
      text: 'text-xs'
    },
    sm: {
      container: 'min-h-[150px]',
      spinner: 'w-6 h-6 border-2',
      text: 'text-sm'
    },
    md: {
      container: 'min-h-[200px]',
      spinner: 'w-10 h-10 border-3',
      text: 'text-base'
    },
    lg: {
      container: 'min-h-[300px]',
      spinner: 'w-12 h-12 border-4',
      text: 'text-lg'
    }
  };

  const sizeClasses = sizeMap[size] || sizeMap.md;

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center ${sizeClasses.container} w-full bg-gray-50 dark:bg-gray-800 bg-opacity-75 rounded-lg p-4`}>
        <div className={`${sizeClasses.spinner} border-gray-300 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400 rounded-full animate-spin`}></div>
      </div>
    );
  }

  return children;
};

export default ChartLoadingIndicator;
