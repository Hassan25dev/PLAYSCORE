/**
 * Utility functions for managing pagination state across navigation
 */

// Constants for localStorage keys
const PAGINATION_STATE_KEY = 'playscore_pagination_state';

/**
 * Save the current pagination state to localStorage
 * @param {Object} state - The pagination state to save
 * @param {number} state.page - The current page number
 * @param {string} state.source - The source page (e.g., 'jeux', 'categories', 'platforms')
 * @param {string} state.search - The current search query (optional)
 * @param {Array} state.filters - Any active filters (optional)
 */
export const savePaginationState = (state) => {
  try {
    localStorage.setItem(PAGINATION_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving pagination state to localStorage:', error);
  }
};

/**
 * Get the saved pagination state from localStorage
 * @returns {Object|null} The saved pagination state or null if not found
 */
export const getPaginationState = () => {
  try {
    const state = localStorage.getItem(PAGINATION_STATE_KEY);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Error retrieving pagination state from localStorage:', error);
    return null;
  }
};

/**
 * Clear the saved pagination state from localStorage
 */
export const clearPaginationState = () => {
  try {
    localStorage.removeItem(PAGINATION_STATE_KEY);
  } catch (error) {
    console.error('Error clearing pagination state from localStorage:', error);
  }
};

/**
 * Get the URL for returning to the correct page in the games list
 * @param {Object} state - The pagination state
 * @returns {string} The URL to navigate to
 */
export const getReturnUrl = (state) => {
  if (!state) return '/jeux';
  
  let url = `/${state.source || 'jeux'}`;
  
  // Add page parameter if it's not page 1
  if (state.page && state.page > 1) {
    url += `?page=${state.page}`;
  }
  
  // Add search parameter if it exists
  if (state.search) {
    url += (url.includes('?') ? '&' : '?') + `search=${encodeURIComponent(state.search)}`;
  }
  
  // Add any other filters if they exist
  if (state.filters && Object.keys(state.filters).length > 0) {
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value) {
        url += (url.includes('?') ? '&' : '?') + `${key}=${encodeURIComponent(value)}`;
      }
    });
  }
  
  return url;
};
