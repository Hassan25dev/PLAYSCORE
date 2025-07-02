import React, { useEffect, useRef } from 'react';

export default function TextInput({ id, type = 'text', name, value, className = '', autoComplete, isFocused = false, onChange, placeholder }) {
  const inputRef = useRef();

  // Focus the input if isFocused is true
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  // Determine if we're on a tablet
  const isTablet = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px) and (max-width: 1024px)').matches;

  // Tablet-specific class adjustments
  const tabletClasses = isTablet ? 'text-base min-h-[44px] px-4 py-3' : '';

  return (
    <input
      id={id}
      type={type}
      name={name}
      value={value}
      className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg sm:rounded-md shadow-sm text-base sm:text-sm min-h-[44px] sm:min-h-[38px] px-4 py-2 w-full ${tabletClasses} ${className}`}
      autoComplete={autoComplete}
      onChange={onChange}
      ref={inputRef}
      placeholder={placeholder}
      style={{
        // Ensure touch targets are at least 44x44px on tablets
        ...(isTablet && { fontSize: '16px' }) // Prevents iOS zoom on focus
      }}
    />
  );
}
