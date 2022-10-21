import Neon, { wallet } from '@cityofzion/neon-js';

export function isValidAddress(address: string): boolean {
  return Neon.is.address(address) && address.startsWith('N');
}

export function addressToScriptHash(address: string): string {
  return `0x${wallet.getScriptHashFromAddress(address)}`;
}

export function scriptHashToAddress(hash: string): string {
  return wallet.getAddressFromScriptHash(hash.replace(/0x/, ''));
}
