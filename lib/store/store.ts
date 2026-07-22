import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { baseApi } from './api/baseApi';
import { algorhythmApi } from './api/algorhythmApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [algorhythmApi.reducerPath]: algorhythmApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, algorhythmApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
