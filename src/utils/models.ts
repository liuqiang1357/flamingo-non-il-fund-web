import { WalletName } from './enums';

export interface WalletInfo {
  name: WalletName;
  image: string;
  downloadUrl: string;
  minimumVersion: string;
  disabled?: boolean;
}

export interface WalletState {
  name: WalletName;
  installed?: boolean;
  address?: string;
  networkReady: boolean;
  version?: string;
}

export interface WalletStatePatch extends Partial<WalletState> {
  name: WalletName;
}

export interface ConnectedWalletState extends WalletState {
  installed: boolean;
  address: string;
  version: string;
}
