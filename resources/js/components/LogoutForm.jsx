import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * A component that handles user logout with proper CSRF token handling
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Optional callback to run before logout
 * @param {string} props.className - Optional CSS class for styling
 * @param {string} props.children - Text or elements to display in the logout button/link
 */
const LogoutForm = ({ onLogout, className = '', children = 'Logout' }) => {
  // Get the CSRF token from the meta tag
  const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  };

  // Handle the logout action
  const handleLogout = (e) => {
    e.preventDefault();
    
    // Run the onLogout callback if provided
    if (typeof onLogout === 'function') {
      onLogout();
    }
    
    // Use Inertia's router to handle the logout with proper CSRF token
    router.post(route('logout'), {}, {
      headers: {
        'X-CSRF-TOKEN': getCsrfToken(),
      },
      onError: (errors) => {
        console.error('Logout error:', errors);
        
        // Fallback to traditional form submission if Inertia fails
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('logout');
        
        // Add CSRF token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = getCsrfToken() || '';
        form.appendChild(csrfInput);
        
        // Add the form to the document, submit it, and remove it
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }
    });
  };

  return (
    <a 
      href="#" 
      onClick={handleLogout}
      className={className}
    >
      {children}
    </a>
  );
};

export default LogoutForm;
