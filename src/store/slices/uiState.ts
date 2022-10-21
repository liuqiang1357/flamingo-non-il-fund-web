import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'hooks/redux';

export const uiStateSlice = createSlice({
  name: 'uiStateSlice',
  initialState: {
    walletsPopoverVisible: false,
  },
  reducers: {
    setConnectWalletVisible: (state, action: PayloadAction<boolean>) => {
      state.walletsPopoverVisible = action.payload;
    },
  },
});

export const { setConnectWalletVisible } = uiStateSlice.actions;

export function useConnectWalletVisible(): boolean {
  return useSelector(state => state.uiStateSlice.walletsPopoverVisible);
}
