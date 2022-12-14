import { Buffer } from 'buffer';
import Neon, { wallet } from '@cityofzion/neon-js';
import BigNumber from 'bignumber.js';

export function integerToDecimal(integer: string, unit: number): string {
  const bn = new BigNumber(integer);
  if (bn.isNaN()) {
    throw new Error('Invalid number');
  }
  return bn.shiftedBy(-unit).toFixed();
}

export function decimalToInteger(decimal: string, unit: number): string {
  const bn = new BigNumber(decimal);
  if (bn.isNaN()) {
    throw new Error('Invalid number');
  }
  return bn.shiftedBy(unit).dp(0, BigNumber.ROUND_DOWN).toFixed();
}

export function stringToBase64(string: string): string {
  return Buffer.from(string).toString('base64');
}

export function base64ToString(hex: string): string {
  return Buffer.from(hex, 'base64').toString();
}

export function isValidAddress(address: string): boolean {
  return Neon.is.address(address) && address.startsWith('N');
}

export function addressToScriptHash(address: string): string {
  return `0x${wallet.getScriptHashFromAddress(address)}`;
}

export function scriptHashToAddress(hash: string): string {
  return wallet.getAddressFromScriptHash(hash.replace(/0x/, ''));
}

export function scriptHashToBase64(string: string): string {
  return Buffer.from(string.replace(/0x/, '')).reverse().toString('base64');
}

export function base64ToScriptHash(hex: string): string {
  return `0x${Buffer.from(hex, 'base64').reverse().toString('hex')}`;
}
