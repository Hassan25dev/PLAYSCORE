import React from 'react';

export default function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="submit"
      className={`inline-flex items-center justify-center px-4 py-3 sm:py-2 bg-indigo-600 border border-transparent rounded-lg sm:rounded-md font-semibold text-sm sm:text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition-all duration-200 min-h-[44px] sm:min-h-[38px] shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
