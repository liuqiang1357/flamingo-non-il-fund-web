import o3dapi from 'o3-dapi-core';
import o3dapiNeo from 'o3-dapi-neo';
import o3dapiNeoN3 from 'o3-dapi-neo3';
import { WalletName } from 'utils/enums';
import { TARGET_MAINNET } from 'utils/env';
import { WalletError } from 'utils/errors';
import { WalletStatePatch } from 'utils/models';
import { BaseWallet } from './base';
import { InvokeParams, SignedMessage } from './types';

const TARGET_NETWORK = TARGET_MAINNET ? 'N3MainNet' : 'N3TestNet';

class O3 extends BaseWallet {
  private neoDapi: any;
  private neoDapiN3: any;

  constructor() {
    super(WalletName.O3);
  }

  async invoke(params: InvokeParams): Promise<string> {
    try {
      const result = await this.neoDapiN3.invoke(params);
      return result.txid;
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  async signMessage(message: string): Promise<SignedMessage> {
    try {
      const { salt, publicKey, data: signature } = await this.neoDapiN3.signMessage({ message });
      return { message, salt, publicKey, signature };
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  // -------- protected methods --------

  protected async checkInstalled(): Promise<boolean> {
    o3dapi.initPlugins([o3dapiNeo, o3dapiNeoN3]);

    this.neoDapi = o3dapi.NEO;
    this.neoDapiN3 = o3dapi.NEO3;

    let neoDapiReady = false;
    let neoDapiN3Ready = false;

    const installed = await new Promise<boolean>(resolve => {
      this.neoDapi.addEventListener(this.neoDapi.Constants.EventName.READY, () => {
        neoDapiReady = true;
        if (neoDapiReady && neoDapiN3Ready) {
          resolve(true);
        }
      });
      this.neoDapiN3.addEventListener(this.neoDapi.Constants.EventName.READY, () => {
        neoDapiN3Ready = true;
        if (neoDapiReady && neoDapiN3Ready) {
          resolve(true);
        }
      });
      setTimeout(() => resolve(false), 5000);
    });

    if (installed) {
      this.neoDapi.addEventListener(
        this.neoDapi.Constants.EventName.ACCOUNT_CHANGED,
        this.updateWalletState,
      );
      this.neoDapi.addEventListener(
        this.neoDapi.Constants.EventName.NETWORK_CHANGED,
        this.updateWalletState,
      );
    }
    return installed;
  }

  protected wasConnected(): boolean {
    return false;
  }

  protected async connectInternal(): Promise<void> {
    try {
      await this.neoDapiN3.getAccount();
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  protected async disconnectInternal(): Promise<void> {
    // noop
  }

  protected async queryWalletState(): Promise<WalletStatePatch> {
    try {
      const network = (await this.neoDapi.getNetworks()).defaultNetwork;
      let address: string | null | undefined;
      if (network === 'MainNet' || network === 'TestNet') {
        address = (await this.neoDapi.getAccount()).address;
      } else {
        address = (await this.neoDapiN3.getAccount()).address;
      }
      const version = (await this.neoDapi.getProvider()).version;
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

  private convertWalletError(error: any) {
    let code = WalletError.Codes.UnknownError;
    switch (error.type) {
      case 'NO_PROVIDER':
        code = WalletError.Codes.NotInstalled;
        break;
      case 'CONNECTION_DENIED':
        code = WalletError.Codes.UserRejected;
        break;
      case 'CONNECTION_REFUSED':
        code = WalletError.Codes.CommunicateFailed;
        break;
      case 'RPC_ERROR':
        code = WalletError.Codes.RemoteRpcError;
        break;
      case 'MALFORMED_INPUT':
        code = WalletError.Codes.MalformedInput;
        break;
      case 'CANCELED':
        code = WalletError.Codes.UserRejected;
        break;
      case 'INSUFFICIENT_FUNDS':
        code = WalletError.Codes.InsufficientFunds;
        break;
    }
    throw new WalletError(error.message ?? error.description, { code, cause: error });
  }
}

export const wallet = new O3();
