import { parse as parseScopes } from '@cityofzion/neon-core/lib/tx/components/WitnessScope';
import WcSdk from '@cityofzion/wallet-connect-sdk-core';
import SignClient from '@walletconnect/sign-client';
import { WalletName } from 'utils/enums';
import { TARGET_MAINNET } from 'utils/env';
import { WalletError } from 'utils/errors';
import { WalletStatePatch } from 'utils/models';
import { BaseWallet } from './base';
import { InvokeParams, SignedMessage } from './types';

const TARGET_NETWORK = TARGET_MAINNET ? 'neo3:mainnet' : 'neo3:testnet';

class Neon extends BaseWallet {
  private wcSdk: WcSdk | undefined;

  constructor() {
    super(WalletName.Neon);
  }

  async invoke(params: InvokeParams): Promise<string> {
    try {
      const result = await this.getWcSdk().invokeFunction({
        invocations: [
          {
            scriptHash: params.scriptHash,
            operation: params.operation,
            args: (params.args as any) ?? [],
          },
        ],
        // TODO: cannot add duplicate cosigner
        signers: (params.signers ?? []).slice(0, 1).map(signer => ({
          account: signer.account,
          scopes: parseScopes(signer.scopes),
          allowedGroups: signer.allowedGroups,
          allowedContracts: signer.allowedContracts,
        })),
      });
      return result;
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  async signMessage(message: string): Promise<SignedMessage> {
    try {
      const {
        salt,
        publicKey,
        data: signature,
      } = await this.getWcSdk().signMessage({ message, version: 1 });
      return { message, salt, publicKey, signature };
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  // -------- protected methods --------
  protected async checkInstalled(): Promise<boolean> {
    this.wcSdk = new WcSdk(
      await SignClient.init({
        projectId: '8a1338596944076cd2e18366504a8aff',
        relayUrl: 'wss://relay.walletconnect.com',
        metadata: {
          name: 'Neo Campus Tour',
          description: 'Decoding Web3 with Neo US campus tour this October.',
          url: 'https://tour.neo.org',
          icons: ['https://tour.neo.org/favicon.ico'],
        },
      }),
    );
    await this.wcSdk.loadSession();
    return true;
  }

  protected wasConnected(): boolean {
    return this.getWcSdk().isConnected() === true;
  }

  protected async connectInternal(forceNewConnection: boolean): Promise<void> {
    try {
      if (forceNewConnection) {
        localStorage.removeItem('walletconnect');
      }
      if (!this.getWcSdk().isConnected()) {
        await this.getWcSdk().connect(TARGET_NETWORK);
      }
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  protected async disconnectInternal(): Promise<void> {
    try {
      await this.getWcSdk().disconnect();
      localStorage.removeItem('walletconnect');
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  protected async queryWalletState(): Promise<WalletStatePatch> {
    try {
      const network = this.getWcSdk().getChainId();
      const address = this.getWcSdk().getAccountAddress();
      return {
        name: this.name,
        address: address ?? undefined,
        networkReady: network === TARGET_NETWORK,
        version: '1.0.0',
      };
    } catch (error) {
      throw this.convertWalletError(error);
    }
  }

  // -------- private methods --------

  private getWcSdk() {
    if (this.wcSdk != undefined) {
      return this.wcSdk;
    }
    throw new Error('wc sdk is not inited');
  }

  private convertWalletError(error: any) {
    const code = WalletError.Codes.UnknownError;
    return new WalletError(error.message, { code, cause: error });
  }
}

export const wallet = new Neon();
