import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { compareVersions } from 'compare-versions';
import pDefer from 'p-defer';
import { $enum } from 'ts-enum-util';
import { useSelector } from 'hooks/redux';
import { State } from 'store';
import { WALLET_INFOS } from 'utils/configs';
import { WalletName } from 'utils/enums';
import { TARGET_MAINNET } from 'utils/env';
import { WalletError } from 'utils/errors';
import { formatEnum } from 'utils/formatters';
import { createAsyncThunk, mapEnumToObject } from 'utils/misc';
import { ConnectedWalletState, WalletState, WalletStatePatch } from 'utils/models';
import { getWallet } from 'utils/wallets';

const CURRENT_WALLET_NAME_KEY = 'CURRENT_WALLET_NAME';

export const walletStatesSlice = createSlice({
  name: 'walletStatesSlice',
  initialState: {
    lastWalletName: undefined as WalletName | undefined,
    walletStates: mapEnumToObject(
      WalletName,
      name =>
        ({
          name,
          networkReady: false,
        } as WalletState),
    ),
  },
  reducers: {
    setLastWalletName: (state, action: PayloadAction<WalletName | undefined>) => {
      state.lastWalletName = action.payload;
    },
    updateWalletState: (state, action: PayloadAction<WalletStatePatch>) => {
      Object.assign(state.walletStates[action.payload.name], action.payload);
    },
  },
});

export const { setLastWalletName, updateWalletState } = walletStatesSlice.actions;

export const loadLastWalletName = createAsyncThunk(
  'loadLastWalletName',
  async (args, { dispatch }) => {
    const data = localStorage.getItem(CURRENT_WALLET_NAME_KEY);
    if ($enum(WalletName).isValue(data)) {
      dispatch(setLastWalletName(data));
    }
  },
);

export const clearLastWalletName = createAsyncThunk(
  'clearLastWalletName',
  async (args, { dispatch }) => {
    dispatch(setLastWalletName(undefined));
    localStorage.removeItem(CURRENT_WALLET_NAME_KEY);
  },
);

export const saveLastWalletName = createAsyncThunk<void, WalletName>(
  'saveLastWalletName',
  async (walletName, { dispatch }) => {
    dispatch(setLastWalletName(walletName));
    localStorage.setItem(CURRENT_WALLET_NAME_KEY, walletName);
  },
);

const deferred = pDefer();

export const initWallets = createAsyncThunk('initWallets', async (args, { dispatch, getState }) => {
  try {
    await dispatch(loadLastWalletName()).unwrap();
    const lastWalletName = selectLastWalletName(getState());
    await Promise.all(
      Object.values(WALLET_INFOS)
        .filter(info => info.disabled !== true)
        .map(async info => {
          const wallet = await getWallet(info.name);
          await wallet.init(
            {
              updateWalletState: patch => dispatch(updateWalletState(patch)),
            },
            lastWalletName === info.name,
          );
        }),
    );
  } finally {
    deferred.resolve();
  }
});

export const ensureWalletReady = createAsyncThunk(
  'ensureWalletReady',
  async (args, { getState }) => {
    await deferred.promise;
    const walletState = selectConnectedWalletState(getState());
    if (walletState == undefined) {
      throw new WalletError('Wallet is not connected.', {
        code: WalletError.Codes.NotConnected,
      });
    }
    if (!walletState.networkReady) {
      throw new WalletError('Wallet is not in correct network.', {
        code: WalletError.Codes.IncorrectNetwork,
        data: {
          walletName: walletState.name,
          walletNetwork: formatEnum(
            TARGET_MAINNET ? 'walletMainNet' : 'walletTestNet',
            walletState.name,
          ),
        },
      });
    }
    if (compareVersions(walletState.version, WALLET_INFOS[walletState.name].minimumVersion) < 0) {
      throw new WalletError('Wallet version is not compatible.', {
        code: WalletError.Codes.VerionNotCompatible,
      });
    }
    return { walletState, wallet: await getWallet(walletState.name) };
  },
);

export function selectLastWalletName(state: State): WalletName | undefined {
  return state.walletStatesSlice.lastWalletName;
}

export function selectWalletStates(state: State): Record<WalletName, WalletState> {
  return state.walletStatesSlice.walletStates;
}

export function useWalletStates(): Record<WalletName, WalletState> {
  return useSelector(selectWalletStates);
}

export const selectWalletState = createSelector(
  selectWalletStates,
  (state: State, { walletName }: { walletName: WalletName }) => walletName,
  (walletStates, walletName) => walletStates[walletName],
);

export const selectLastWalletState = createSelector(
  selectWalletStates,
  selectLastWalletName,
  (walletStates, walletName) => (walletName != undefined ? walletStates[walletName] : undefined),
);

export const selectConnectedWalletState = createSelector(selectLastWalletState, walletState => {
  if (walletState && walletState.address != undefined) {
    return walletState as ConnectedWalletState;
  }
  return undefined;
});

export function useConnectedWalletState(): ConnectedWalletState | undefined {
  return useSelector(selectConnectedWalletState);
}
