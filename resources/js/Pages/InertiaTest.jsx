import React from 'react';
import { Head } from '@inertiajs/react';

/**
 * Simple test page to verify Inertia.js is working correctly
 * This page has minimal dependencies to isolate loading issues
 */
export default function InertiaTest({ message = 'Inertia.js is working!' }) {
  console.log('InertiaTest: Component rendered successfully');
  console.log('InertiaTest: Props received:', { message });

  return (
    <>
      <Head title="Inertia Test" />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Inertia Test Page
            </h1>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <p><strong>Component:</strong> InertiaTest.jsx</p>
                <p><strong>Framework:</strong> React + Inertia.js</p>
                <p><strong>Status:</strong> ✅ Working</p>
              </div>
              
              <div className="flex space-x-4 justify-center">
                <a 
                  href="/" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Go Home
                </a>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Reload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
