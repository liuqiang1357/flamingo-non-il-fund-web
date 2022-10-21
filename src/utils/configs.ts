import neoline from 'assets/images/common/wallets/neoline.png';
import neon from 'assets/images/common/wallets/neon.png';
import o3 from 'assets/images/common/wallets/o3.png';
import onegate from 'assets/images/common/wallets/onegate.svg';
import { WalletName } from './enums';
import { TARGET_MAINNET } from './env';
import { WalletInfo } from './models';

export const NODE_URL = TARGET_MAINNET
  ? 'https://neofura.ngd.network'
  : 'https://testmagnet.ngd.network';

export const FURA_URL = TARGET_MAINNET
  ? 'https://neofura.ngd.network'
  : 'https://testmagnet.ngd.network';

export const WALLET_INFOS: Record<WalletName, WalletInfo> = {
  [WalletName.OneGate]: {
    name: WalletName.OneGate,
    image: onegate,
    downloadUrl: 'https://onegate.space',
    minimumVersion: '0.0.0',
  },
  [WalletName.NeoLine]: {
    name: WalletName.NeoLine,
    image: neoline,
    downloadUrl:
      'https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao',
    minimumVersion: '0.0.0',
  },
  [WalletName.O3]: {
    name: WalletName.O3,
    image: o3,
    downloadUrl: 'https://o3.network/#download',
    minimumVersion: '0.0.0',
  },
  [WalletName.Neon]: {
    name: WalletName.Neon,
    image: neon,
    downloadUrl: 'https://neonwallet.com',
    minimumVersion: '0.0.0',
  },
};
