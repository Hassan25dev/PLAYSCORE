import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour charger les genres
export const fetchGenres = createAsyncThunk(
  'genres/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://api.rawg.io/api/genres?key=5111ba2144c14dd885848f5a82139095`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return rejectWithValue(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check if the data is valid
      if (!data || !data.results) {
        console.error('API returned invalid genres format', data);
        return [];
      }

      return data.results;
    } catch (error) {
      console.error('Error fetching genres:', error);
      if (error.name === 'AbortError') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      return rejectWithValue(error.message || 'Failed to fetch genres');
    }
  }
);

const genresSlice = createSlice({
  name: 'genres',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Sélecteurs
export const selectAllGenres = (state) => state.genres.list;
export const selectGenreStatus = (state) => state.genres.status;
export const selectGenreError = (state) => state.genres.error;

// Export du reducer
export default genresSlice.reducer;