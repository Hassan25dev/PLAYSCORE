import React from 'react';

export default function Checkbox({ name, checked, onChange }) {
  return (
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
    />
  );
}
