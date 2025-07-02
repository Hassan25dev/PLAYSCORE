import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import genresReducer from './genresSlice';
import platformsReducer from './platformsSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    genres: genresReducer,
    platforms: platformsReducer,
  },
  // Add middleware or other configuration options here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for better performance
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;