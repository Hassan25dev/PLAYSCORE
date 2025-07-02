import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour charger les plateformes
export const fetchPlatforms = createAsyncThunk(
  'platforms/fetchPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(
        `https://api.rawg.io/api/platforms?key=5111ba2144c14dd885848f5a82139095`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return rejectWithValue(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Check if the data is valid
      if (!data || !data.results) {
        console.error('API returned invalid platforms format', data);
        return [];
      }

      return data.results;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      if (error.name === 'AbortError') {
        return rejectWithValue('Request timed out. Please try again.');
      }
      return rejectWithValue(error.message || 'Failed to fetch platforms');
    }
  }
);

const platformsSlice = createSlice({
  name: 'platforms',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Sélecteurs
export const selectAllPlatforms = (state) => state.platforms.list;
export const selectPlatformStatus = (state) => state.platforms.status;
export const selectPlatformError = (state) => state.platforms.error;

// Export du reducer
export default platformsSlice.reducer;