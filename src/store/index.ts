import { configureStore } from '@reduxjs/toolkit';
import { invokeApi } from './apis/invoke';
import { nodeApi } from './apis/node';
import { errorsSlice } from './slices/errors';
import { uiStateSlice } from './slices/uiState';
import { walletStatesSlice } from './slices/walletStates';

export const store = configureStore({
  reducer: {
    [errorsSlice.name]: errorsSlice.reducer,
    [walletStatesSlice.name]: walletStatesSlice.reducer,
    [uiStateSlice.name]: uiStateSlice.reducer,
    [nodeApi.reducerPath]: nodeApi.reducer,
    [invokeApi.reducerPath]: invokeApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(nodeApi.middleware, invokeApi.middleware),
});

export type Store = typeof store;
export type Dispatch = Store['dispatch'];
export type GetState = Store['getState'];
export type State = ReturnType<GetState>;
