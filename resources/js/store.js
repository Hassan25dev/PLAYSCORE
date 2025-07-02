import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './logiqueredux/gamesSlice';
import genresReducer from './logiqueredux/genresSlice';
import platformsReducer from './logiqueredux/platformsSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    genres: genresReducer,
    platforms: platformsReducer,
  },
});
