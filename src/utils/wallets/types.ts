import { WalletStatePatch } from 'utils/models';

export interface WalletActions {
  updateWalletState(patch: WalletStatePatch): void;
}

export interface Argument {
  type: string;
  value: any;
}

export interface Signer {
  account: string;
  scopes: string;
  allowedContracts?: string[];
  allowedGroups?: string[];
}

export interface InvokeParams {
  scriptHash: string;
  operation: string;
  args?: Argument[];
  signers?: Signer[];
}

export interface SignedMessage {
  message: string;
  salt: string;
  publicKey: string;
  signature: string;
}

export interface Wallet {
  init(actions: WalletActions, restoreConnection: boolean): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  invoke(params: InvokeParams): Promise<string>;
  signMessage(message: string): Promise<SignedMessage>;
}
