/**
 * Game image utilities
 * This file provides reliable image URLs for games
 */

// Collection of reliable external image URLs for different game genres/types
export const gameImages = {
  // Action games
  action: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/7915509/pexels-photo-7915509.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/7915478/pexels-photo-7915478.jpeg?w=800&auto=format&fit=crop',
  ],

  // RPG games
  rpg: [
    'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/7915255/pexels-photo-7915255.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/7919635/pexels-photo-7919635.jpeg?w=800&auto=format&fit=crop',
  ],

  // Strategy games
  strategy: [
    'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/5477775/pexels-photo-5477775.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/1329545/pexels-photo-1329545.jpeg?w=800&auto=format&fit=crop',
  ],

  // Sports games
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?w=800&auto=format&fit=crop',
  ],

  // Racing games
  racing: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/3608542/pexels-photo-3608542.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?w=800&auto=format&fit=crop',
  ],

  // Default/generic games
  default: [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/159393/gamepad-video-game-controller-game-controller-controller-159393.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/2885014/pexels-photo-2885014.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/2728255/pexels-photo-2728255.jpeg?w=800&auto=format&fit=crop',
    'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?w=800&auto=format&fit=crop',
  ],
};

// Map of game keywords to image categories
export const gameKeywordMap = {
  // Action games
  'action': 'action',
  'shooter': 'action',
  'fps': 'action',
  'fighting': 'action',
  'battle': 'action',
  'combat': 'action',
  'shoot': 'action',
  'gun': 'action',
  'war': 'action',
  'call of duty': 'action',
  'battlefield': 'action',
  'doom': 'action',
  'halo': 'action',
  'gears': 'action',
  'counter': 'action',
  'apex': 'action',
  'fortnite': 'action',
  'overwatch': 'action',
  'valorant': 'action',

  // RPG games
  'rpg': 'rpg',
  'role-playing': 'rpg',
  'fantasy': 'rpg',
  'adventure': 'rpg',
  'dragon': 'rpg',
  'souls': 'rpg',
  'witcher': 'rpg',
  'skyrim': 'rpg',
  'elder scrolls': 'rpg',
  'fallout': 'rpg',
  'baldur': 'rpg',
  'final fantasy': 'rpg',
  'kingdom': 'rpg',
  'zelda': 'rpg',
  'diablo': 'rpg',
  'elden': 'rpg',
  'dark souls': 'rpg',
  'mass effect': 'rpg',
  'persona': 'rpg',
  'dragon age': 'rpg',
  'monster hunter': 'rpg',

  // Strategy games
  'strategy': 'strategy',
  'tactical': 'strategy',
  'rts': 'strategy',
  'turn-based': 'strategy',
  'civilization': 'strategy',
  'management': 'strategy',
  'simulation': 'strategy',
  'sim': 'strategy',
  'city': 'strategy',
  'builder': 'strategy',
  'tycoon': 'strategy',
  'xcom': 'strategy',
  'starcraft': 'strategy',
  'warcraft': 'strategy',
  'command': 'strategy',
  'conquer': 'strategy',
  'age of': 'strategy',
  'total war': 'strategy',
  'anno': 'strategy',
  'crusader': 'strategy',

  // Sports games
  'sports': 'sports',
  'football': 'sports',
  'soccer': 'sports',
  'basketball': 'sports',
  'baseball': 'sports',
  'hockey': 'sports',
  'fifa': 'sports',
  'nba': 'sports',
  'madden': 'sports',
  'nfl': 'sports',
  'mlb': 'sports',
  'nhl': 'sports',
  'tennis': 'sports',
  'golf': 'sports',
  'pga': 'sports',
  'wrestling': 'sports',
  'wwe': 'sports',
  'olympic': 'sports',

  // Racing games
  'racing': 'racing',
  'driving': 'racing',
  'car': 'racing',
  'formula': 'racing',
  'forza': 'racing',
  'gran turismo': 'racing',
  'need for speed': 'racing',
  'dirt': 'racing',
  'rally': 'racing',
  'f1': 'racing',
  'motorsport': 'racing',
  'crew': 'racing',
  'burnout': 'racing',
  'asphalt': 'racing',
  'grid': 'racing',
  'mario kart': 'racing',
};

/**
 * Get an appropriate image URL for a game based on its name or genre
 * @param {string} gameName - The name of the game
 * @param {Array} genres - Optional array of game genres
 * @returns {string} A URL to an appropriate image
 */
export function getGameImageUrl(gameName, genres = []) {
  // Convert game name to lowercase for matching
  const gameNameLower = (gameName || '').toLowerCase();

  // Use a deterministic approach for consistent image selection
  // Create a hash from the game name to always get the same image for the same game
  const getHashFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Try to match by game name first
  for (const [keyword, category] of Object.entries(gameKeywordMap)) {
    if (gameNameLower.includes(keyword)) {
      const categoryImages = gameImages[category];
      const index = getHashFromString(gameNameLower) % categoryImages.length;
      return categoryImages[index];
    }
  }

  // If no match by name, try to match by genres
  if (genres && genres.length > 0) {
    for (const genre of genres) {
      if (!genre) continue;

      const genreLower = genre.toLowerCase();
      for (const [keyword, category] of Object.entries(gameKeywordMap)) {
        if (genreLower.includes(keyword)) {
          const categoryImages = gameImages[category];
          const index = getHashFromString(gameNameLower + genreLower) % categoryImages.length;
          return categoryImages[index];
        }
      }
    }
  }

  // If no matches, return a deterministic default image based on the game name
  const defaultImages = gameImages.default;
  const index = getHashFromString(gameNameLower) % defaultImages.length;
  return defaultImages[index];
}
