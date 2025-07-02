/**
 * Utility functions for generating placeholder images
 */

// Color palettes for different game genres
const genreColors = {
  action: {
    bg: '1e3a8a', // Deep blue
    text: 'ffffff'
  },
  rpg: {
    bg: '4c1d95', // Deep purple
    text: 'ffffff'
  },
  strategy: {
    bg: '064e3b', // Deep green
    text: 'ffffff'
  },
  sports: {
    bg: '7f1d1d', // Deep red
    text: 'ffffff'
  },
  racing: {
    bg: '78350f', // Deep orange
    text: 'ffffff'
  },
  default: {
    bg: '1e2235', // Dark blue-gray
    text: 'b8c0ff'
  }
};

// Map of game keywords to genres (simplified from gameImages.js)
const gameGenreMap = {
  // Action games
  'action': 'action',
  'shooter': 'action',
  'fps': 'action',
  'fighting': 'action',
  'battle': 'action',
  'combat': 'action',
  
  // RPG games
  'rpg': 'rpg',
  'role-playing': 'rpg',
  'fantasy': 'rpg',
  'adventure': 'rpg',
  'dragon': 'rpg',
  'souls': 'rpg',
  
  // Strategy games
  'strategy': 'strategy',
  'tactical': 'strategy',
  'rts': 'strategy',
  'turn-based': 'strategy',
  'simulation': 'strategy',
  
  // Sports games
  'sports': 'sports',
  'football': 'sports',
  'soccer': 'sports',
  'basketball': 'sports',
  
  // Racing games
  'racing': 'racing',
  'driving': 'racing',
  'car': 'racing',
};

/**
 * Determine the genre of a game based on its name or genres
 * @param {string} gameName - The name of the game
 * @param {Array} genres - Optional array of game genres
 * @returns {string} The determined genre
 */
function determineGenre(gameName, genres = []) {
  // Convert game name to lowercase for matching
  const gameNameLower = (gameName || '').toLowerCase();
  
  // Try to match by game name first
  for (const [keyword, genre] of Object.entries(gameGenreMap)) {
    if (gameNameLower.includes(keyword)) {
      return genre;
    }
  }
  
  // If no match by name, try to match by genres
  if (genres && genres.length > 0) {
    for (const genre of genres) {
      if (!genre) continue;
      
      const genreLower = typeof genre === 'string' 
        ? genre.toLowerCase() 
        : (genre.name ? genre.name.toLowerCase() : '');
      
      for (const [keyword, genreType] of Object.entries(gameGenreMap)) {
        if (genreLower.includes(keyword)) {
          return genreType;
        }
      }
    }
  }
  
  // If no matches, return default
  return 'default';
}

/**
 * Generate a placeholder image URL for a game
 * @param {string} gameName - The name of the game
 * @param {Array} genres - Optional array of game genres
 * @param {number} width - Width of the placeholder image
 * @param {number} height - Height of the placeholder image
 * @returns {string} URL to a placeholder image
 */
export function getPlaceholderImage(gameName, genres = [], width = 600, height = 400) {
  // Determine the genre for color selection
  const genre = determineGenre(gameName, genres);
  
  // Get colors for the determined genre
  const colors = genreColors[genre] || genreColors.default;
  
  // Create a display name (limit to 20 chars to fit nicely)
  const displayName = gameName && gameName.length > 20 
    ? gameName.substring(0, 17) + '...' 
    : (gameName || 'Game');
  
  // Generate a placeholder URL
  return `https://placehold.co/${width}x${height}/${colors.bg}/${colors.text}?text=${encodeURIComponent(displayName)}`;
}

/**
 * Preload a placeholder image
 * @param {string} gameName - The name of the game
 * @param {Array} genres - Optional array of game genres
 */
export function preloadPlaceholder(gameName, genres = []) {
  const img = new Image();
  img.src = getPlaceholderImage(gameName, genres);
  return img.src;
}
