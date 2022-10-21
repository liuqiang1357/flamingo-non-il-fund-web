import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'hooks/redux';
import { createAsyncThunk } from 'utils/misc';

export const errorsSlice = createSlice({
  name: 'errorsSlice',
  initialState: {
    last: undefined as Error | undefined,
  },
  reducers: {
    publishError: (state, action: PayloadAction<Error>) => {
      state.last = action.payload;
    },
    clearError: (state, action: PayloadAction<Error>) => {
      if (state.last === action.payload) {
        state.last = undefined;
      }
    },
  },
});

export const { publishError, clearError } = errorsSlice.actions;

export const registerErrorHandler = createAsyncThunk(
  'registerErrorHandler',
  async (args, { dispatch }) => {
    window.addEventListener('error', event => {
      event.preventDefault();
      if (event.error instanceof Error) {
        dispatch(publishError(event.error));
      }
    });
    window.addEventListener('unhandledrejection', event => {
      event.preventDefault();
      if (event.reason instanceof Error) {
        dispatch(publishError(event.reason));
      }
    });
  },
);

export function useLastError(): Error | undefined {
  return useSelector(state => state.errorsSlice.last);
}
