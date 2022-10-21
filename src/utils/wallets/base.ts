import { WalletName } from 'utils/enums';
import { WalletStatePatch } from 'utils/models';
import { InvokeParams, SignedMessage, Wallet, WalletActions } from './types';

export abstract class BaseWallet implements Wallet {
  private actions: WalletActions | undefined;

  private connected = false;

  constructor(protected name: WalletName) {}

  async init(actions: WalletActions, restoreConnection: boolean): Promise<void> {
    this.actions = actions;

    const installed = await this.checkInstalled();
    actions?.updateWalletState({ name: this.name, installed });

    if (!installed) {
      return;
    }
    if (this.wasConnected() && restoreConnection) {
      await this.connect(false);
    }
  }

  async connect(forceNewConnection = true): Promise<void> {
    if (this.connected) {
      await this.disconnect();
    }
    await this.connectInternal(forceNewConnection);
    this.connected = true;

    await this.updateWalletState();
  }

  async disconnect(): Promise<void> {
    await this.disconnectInternal();
    this.connected = false;

    this.actions?.updateWalletState({
      name: this.name,
      address: undefined,
      networkReady: false,
      version: undefined,
    });
  }

  abstract invoke(params: InvokeParams): Promise<string>;

  abstract signMessage(message: string): Promise<SignedMessage>;

  // -------- protected methods --------

  protected abstract checkInstalled(): Promise<boolean>;

  protected abstract wasConnected(): boolean;

  protected abstract connectInternal(forceNewConnection: boolean): Promise<void>;

  protected abstract disconnectInternal(): Promise<void>;

  protected updateWalletState = async (): Promise<void> => {
    this.actions?.updateWalletState(await this.queryWalletState());
  };

  protected abstract queryWalletState(): Promise<WalletStatePatch>;
}
