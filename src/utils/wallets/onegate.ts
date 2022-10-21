import { StandardErrorCodes } from '@neongd/json-rpc';
import { BaseNeoDapi, NeoDapi, NeoDapiErrorCodes } from '@neongd/neo-dapi';
import { NeoProvider } from '@neongd/neo-provider';
import { WalletName } from 'utils/enums';
import { TARGET_MAINNET } from 'utils/env';
import { WalletError } from 'utils/errors';
import { WalletStatePatch } from 'utils/models';
import { BaseWallet } from './base';
import { InvokeParams, SignedMessage } from './types';

declare const window: globalThis.Window & {
  OneGate: NeoProvider | undefined;
};

const ONEGATE_WAS_CONNECTED_KEY = 'ONEGATE_WAS_CONNECTED';
const TARGET_NETWORK = TARGET_MAINNET ? 'MainNet' : 'TestNet';

class OneGate extends BaseWallet {
  private neoDapi: NeoDapi | undefined;

  constructor() {
    super(WalletName.OneGate);
  }

  async invoke(params: InvokeParams): Promise<string> {
    try {
      const result = await this.getNeoDapi().invoke(params);
      return result.txid;
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  async signMessage(message: string): Promise<SignedMessage> {
    try {
      const { salt, publicKey, signature } = await this.getNeoDapi().signMessage({
        message: message,
      });
      return { message, salt, publicKey, signature };
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  // -------- protected methods --------

  protected async checkInstalled(): Promise<boolean> {
    const installed = window.OneGate != undefined;

    if (installed && window.OneGate) {
      this.neoDapi = new BaseNeoDapi(window.OneGate);

      window.OneGate.on('accountChanged', this.updateWalletState);
      window.OneGate.on('networkChanged', this.updateWalletState);
    }
    return installed;
  }

  protected wasConnected(): boolean {
    return localStorage.getItem(ONEGATE_WAS_CONNECTED_KEY) === 'true';
  }

  protected isConnected(): boolean {
    return localStorage.getItem(ONEGATE_WAS_CONNECTED_KEY) === 'true';
  }

  protected async connectInternal(): Promise<void> {
    try {
      await this.getNeoDapi().getAccount();
      localStorage.setItem(ONEGATE_WAS_CONNECTED_KEY, 'true');
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  protected async disconnectInternal(): Promise<void> {
    localStorage.removeItem(ONEGATE_WAS_CONNECTED_KEY);
  }

  protected async queryWalletState(): Promise<WalletStatePatch> {
    try {
      const network = (await this.getNeoDapi().getNetworks()).defaultNetwork;
      const address = (await this.getNeoDapi().getAccount()).address;
      const version = (await this.getNeoDapi().getProvider()).version;
      return {
        name: this.name,
        address: address ?? undefined,
        networkReady: network === TARGET_NETWORK,
        version,
      };
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  // -------- private methods --------

  private getNeoDapi() {
    if (this.neoDapi != undefined) {
      return this.neoDapi;
    }
    throw new Error('neo dapi is not inited');
  }

  private convertWalletError(error: any) {
    let code = WalletError.Codes.UnknownError;
    switch (error.code) {
      case StandardErrorCodes.InvalidParams:
        code = WalletError.Codes.MalformedInput;
        break;
      case NeoDapiErrorCodes.UnsupportedNetwork:
        code = WalletError.Codes.UnsupportedNetwork;
        break;
      case NeoDapiErrorCodes.NoAccount:
        code = WalletError.Codes.NoAccount;
        break;
      case NeoDapiErrorCodes.InsufficientFunds:
        code = WalletError.Codes.InsufficientFunds;
        break;
      case NeoDapiErrorCodes.RemoteRpcError:
        code = WalletError.Codes.RemoteRpcError;
        break;
      case NeoDapiErrorCodes.UserRejected:
        code = WalletError.Codes.UserRejected;
        break;
    }
    return new WalletError(error.message, { code, cause: error });
  }
}

export const wallet = new OneGate();
