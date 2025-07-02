import React from 'react';
import { Head } from '@inertiajs/react';

export default function GuestLayout({ children }) {
  return (
    <>
      <Head title="Guest" />
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
        <div>{children}</div>
      </div>
    </>
  );
}
