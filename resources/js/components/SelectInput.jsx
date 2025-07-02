import React from 'react';

export default function SelectInput({ id, name, value, className = '', required = false, children, onChange }) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
      required={required}
      onChange={onChange}
    >
      {children}
    </select>
  );
}
