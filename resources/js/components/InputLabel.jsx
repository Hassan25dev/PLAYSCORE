import React from 'react';

export default function InputLabel({ htmlFor, value, className = '', children, required = false }) {
  return (
    <label htmlFor={htmlFor} className={`block font-medium text-base sm:text-sm text-gray-700 mb-1.5 sm:mb-1 ${className}`}>
      {value || children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
