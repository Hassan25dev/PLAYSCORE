import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour charger les jeux
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async ({ page = 1, search = '', genres = '', platforms = '', sort = '' }, { rejectWithValue }) => {
    try {
      // Use our Laravel proxy endpoint instead of calling RAWG directly
      let url = `/api/rawg/games?page=${page}`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (genres) {
        url += `&genres=${encodeURIComponent(genres)}`;
      }

      if (platforms) {
        url += `&platforms=${encodeURIComponent(platforms)}`;
      }

      if (sort) {
        url += `&sort=${encodeURIComponent(sort)}`;
      }

      // Log the complete URL for debugging
      console.log('Fetching games with URL:', url);

      // Add additional debugging for search parameter
      if (search) {
        console.log('Search parameter detected:', search);
      }

      // Use a try-catch block specifically for the fetch operation
      try {
        // Create an AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn('Request timeout reached, aborting fetch');
          controller.abort();
        }, 30000); // 30 second timeout

        // Create a fetch request with AbortController
        const response = await fetch(url, {
          // Add cache control headers to prevent caching issues
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          signal: controller.signal
        });

        // Clear the timeout since the request completed
        clearTimeout(timeoutId);

        if (!response.ok) {
          return rejectWithValue(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Log the data for debugging
        console.log('API response data:', data);

        // If data is an array, wrap it in a results object
        if (Array.isArray(data)) {
          return {
            results: data,
            count: data.length
          };
        }

        // If data already has a results property, return it as is
        if (data && data.results) {
          return data;
        }

        // Return empty results if the API fails to return proper data
        console.error('API returned invalid data format', data);
        return {
          results: [],
          count: 0
        };
      } catch (fetchError) {
        console.error('Fetch operation error:', fetchError);

        // Handle abort errors (timeouts)
        if (fetchError.name === 'AbortError') {
          console.warn('Request was aborted (timeout)');
          return rejectWithValue('Request timed out. Please try again.');
        }

        // Handle network errors more gracefully
        if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
          console.warn('Network error occurred');
          return rejectWithValue('Network error. Please check your connection and try again.');
        }

        // Log more details about the error
        console.error('Detailed fetch error:', {
          name: fetchError.name,
          message: fetchError.message,
          stack: fetchError.stack
        });

        // Handle any other errors
        return rejectWithValue(fetchError.message || 'An error occurred while fetching games');
      }
    } catch (error) {
      console.error('Error in fetchGames thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch games');
    }
  }
);

// Action asynchrone pour charger les détails d'un jeu
export const fetchGameDetails = createAsyncThunk(
  'games/fetchGameDetails',
  async (gameId, { rejectWithValue }) => {
    try {
      // Log the request for debugging
      console.log('Fetching game details for ID:', gameId);

      // Use a try-catch block specifically for the fetch operation
      try {
        // Create an AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        // Use our Laravel proxy endpoint instead of calling RAWG directly
        const response = await fetch(
          `/api/rawg/games/${gameId}`,
          {
            // Add cache control headers to prevent caching issues
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            signal: controller.signal
          }
        );

        // Clear the timeout since the request completed
        clearTimeout(timeoutId);

        if (!response.ok) {
          return rejectWithValue(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Log the data for debugging
        console.log('Game details API response data:', data);

        // Check if the data is valid
        if (!data || typeof data !== 'object') {
          console.error('API returned invalid game details format', data);
          return {};
        }

        return data;
      } catch (fetchError) {
        console.error('Fetch operation error:', fetchError);

        // Handle network errors more gracefully
        if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
          console.warn('Network error occurred');
          return rejectWithValue('Network error. Please check your connection and try again.');
        }

        // Handle any other errors
        return rejectWithValue(fetchError.message || 'An error occurred while fetching game details');
      }
    } catch (error) {
      console.error('Error in fetchGameDetails thunk:', error);
      return rejectWithValue(error.message || 'Failed to fetch game details');
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    list: [],
    currentGame: null,
    userRatings: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    searchQuery: '',
    selectedGenres: [],
    selectedPlatforms: [],
  },
  reducers: {
    // Action pour noter un jeu
    rateGame: (state, action) => {
      const { gameId, rating } = action.payload;
      state.userRatings[gameId] = rating;

      // Mise à jour de la note dans la liste des jeux
      const game = state.list.find(g => g.id === gameId);
      if (game) {
        if (!game.ratings_count) game.ratings_count = 0;
        if (!game.rating) game.rating = 0;

        // Calcul de la nouvelle moyenne
        const oldTotal = game.rating * game.ratings_count;
        game.ratings_count++;
        game.rating = (oldTotal + rating) / game.ratings_count;
      }

      // Mise à jour du jeu courant si c'est celui qui est noté
      if (state.currentGame && state.currentGame.id === gameId) {
        if (!state.currentGame.ratings_count) state.currentGame.ratings_count = 0;
        if (!state.currentGame.rating) state.currentGame.rating = 0;

        const oldTotal = state.currentGame.rating * state.currentGame.ratings_count;
        state.currentGame.ratings_count++;
        state.currentGame.rating = (oldTotal + rating) / state.currentGame.ratings_count;
      }
    },

    // Action pour définir la page courante
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // Action pour définir la recherche
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Réinitialiser à la première page lors d'une nouvelle recherche
    },

    // Action pour définir les genres sélectionnés
    setSelectedGenres: (state, action) => {
      state.selectedGenres = action.payload;
      state.currentPage = 1; // Réinitialiser à la première page lors d'un changement de filtres
    },

    // Action pour définir les plateformes sélectionnées
    setSelectedPlatforms: (state, action) => {
      state.selectedPlatforms = action.payload;
      state.currentPage = 1; // Réinitialiser à la première page lors d'un changement de filtres
    },

    // Action pour réinitialiser les filtres
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedGenres = [];
      state.selectedPlatforms = [];
      state.currentPage = 1;
    },

    // Action pour effacer les erreurs
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Gestion de fetchGames
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Log the full payload for debugging
        console.log('fetchGames.fulfilled payload:', action.payload);

        // Check if the response has results property (RAWG API format)
        if (action.payload && action.payload.results) {
          // If results is an array, use it directly
          if (Array.isArray(action.payload.results)) {
            state.list = action.payload.results;

            // Use the count from the API response for total count
            // Make sure we're getting the total count, not just the count of current results
            state.totalCount = parseInt(action.payload.count) || action.payload.results.length;

            // Calculate total pages based on the total count and page size (20)
            state.totalPages = Math.ceil(state.totalCount / 20);

            console.log('Updated state with totalCount:', state.totalCount, 'totalPages:', state.totalPages, 'current results:', action.payload.results.length);
          } else {
            // Handle case where results is not an array (unexpected format)
            console.error('Unexpected results format:', action.payload.results);
            state.list = [];
            state.totalCount = 0;
            state.totalPages = 0;
          }
        } else if (Array.isArray(action.payload)) {
          // Handle case where payload is directly an array
          state.list = action.payload;
          state.totalCount = action.payload.length;
          state.totalPages = Math.ceil(state.totalCount / 20);
        } else {
          // Fallback to empty array if response format is unexpected
          console.error('Unexpected payload format:', action.payload);
          state.list = [];
          state.totalCount = 0;
          state.totalPages = 0;
        }

        // Ensure totalPages is at least 1 if we have any results
        if (state.list.length > 0 && state.totalPages === 0) {
          state.totalPages = 1;
        }

        state.error = null;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Gestion de fetchGameDetails
      .addCase(fetchGameDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(fetchGameDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export des actions
export const {
  rateGame,
  setCurrentPage,
  setSearchQuery,
  setSelectedGenres,
  setSelectedPlatforms,
  resetFilters,
  clearError
} = gamesSlice.actions;

// Sélecteurs
export const selectAllGames = (state) => state.games.list;
export const selectCurrentGame = (state) => state.games.currentGame;
export const selectGameStatus = (state) => state.games.status;
export const selectGameError = (state) => state.games.error;
export const selectCurrentPage = (state) => state.games.currentPage;
export const selectTotalPages = (state) => state.games.totalPages;
export const selectTotalCount = (state) => state.games.totalCount;
export const selectSearchQuery = (state) => state.games.searchQuery;
export const selectSelectedGenres = (state) => state.games.selectedGenres;
export const selectSelectedPlatforms = (state) => state.games.selectedPlatforms;
export const selectUserRating = (state, gameId) => state.games.userRatings[gameId];

// Export du reducer
export default gamesSlice.reducer;
