import React from 'react';

export default function TextArea({ id, name, value, className = '', required = false, rows = 4, onChange }) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
      required={required}
      rows={rows}
      onChange={onChange}
    />
  );
}
