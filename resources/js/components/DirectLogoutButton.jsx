import React from 'react';

/**
 * A direct logout button that uses window.location to navigate to a logout URL
 * This bypasses CSRF token issues by using GET method with a special token
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Optional callback to run before logout
 * @param {string} props.className - Optional CSS class for styling
 * @param {React.ReactNode} props.children - Text or elements to display in the button
 */
const DirectLogoutButton = ({ onLogout, className = '', children = 'Logout' }) => {
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
    
    // Generate a timestamp to prevent caching
    const timestamp = new Date().getTime();
    const csrfToken = getCsrfToken() || '';
    
    // Redirect to the logout URL with a timestamp parameter and CSRF token
    window.location.href = `/logout-redirect?_t=${timestamp}&_token=${csrfToken}`;
  };
  
  return (
    <a 
      href="#" 
      onClick={handleLogout}
      className={className}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </a>
  );
};

export default DirectLogoutButton;
