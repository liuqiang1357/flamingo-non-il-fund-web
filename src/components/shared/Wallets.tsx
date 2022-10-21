import { Popover } from 'antd';
import { ComponentProps, CSSProperties, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import disconnectImage from 'assets/images/shared/disconnect.svg';
import { Button } from 'components/base/Button';
import { useDispatch, useStore } from 'hooks/redux';
import { setConnectWalletVisible, useConnectWalletVisible } from 'store/slices/uiState';
import {
  clearLastWalletName,
  saveLastWalletName,
  selectWalletState,
  useConnectedWalletState,
  useWalletStates,
} from 'store/slices/walletStates';
import { WALLET_INFOS } from 'utils/configs';
import { WalletName } from 'utils/enums';
import { formatLongText } from 'utils/formatters';
import { getWallet } from 'utils/wallets';

export const Wallets: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const walletState = useConnectedWalletState();

  const walletsPopoverVisible = useConnectWalletVisible();

  const store = useStore();

  const dispatch = useDispatch();

  const walletStates = useWalletStates();

  const connect = async (walletName: WalletName) => {
    const walletState = selectWalletState(store.getState(), { walletName });
    if (walletState.installed === false) {
      window.open(WALLET_INFOS[walletName].downloadUrl);
      return;
    }
    const wallet = await getWallet(walletName);
    await wallet.connect();
    dispatch(saveLastWalletName(walletName));
    dispatch(setConnectWalletVisible(false));
  };

  const disconnect = async () => {
    if (!walletState) {
      return;
    }
    const wallet = await getWallet(walletState.name);
    await wallet.disconnect();
    dispatch(clearLastWalletName());
  };

  return (
    <div className={twMerge('', className)} {...props}>
      {walletState ? (
        <div className="relative">
          <Button className="h-[40px] rounded-full" type="outline" size="sm" onClick={disconnect}>
            <img className="h-[16px] w-[16px]" src={WALLET_INFOS[walletState.name].image} />
            <div className="ml-[8px]">
              {formatLongText(walletState.address, { headTailLength: 5 })}
            </div>
          </Button>
          <Button
            className="absolute inset-0  inline-flex opacity-0 hover:opacity-100"
            type="filled"
            color="red"
            size="sm"
            onClick={disconnect}
          >
            <img src={disconnectImage} />
            <div className="ml-[8px]">Disconnect</div>
          </Button>
        </div>
      ) : (
        <Popover
          visible={walletsPopoverVisible}
          onVisibleChange={visible => dispatch(setConnectWalletVisible(visible))}
          overlayStyle={{ '--popover-border-radius': '10px' } as CSSProperties}
          trigger="click"
          content={
            <div className="flex min-w-[200px] flex-col space-y-[8px] p-[24px]">
              {Object.values(WALLET_INFOS)
                .filter(info => info.disabled !== true)
                .map(info => (
                  <Button
                    key={info.name}
                    className="justify-start px-[24px]"
                    type="outline"
                    size="sm"
                    disabled={walletStates[info.name].installed == undefined}
                    onClick={() => connect(info.name)}
                  >
                    <img src={info.image} />
                    <div className="ml-[8px]">{info.name}</div>
                  </Button>
                ))}
            </div>
          }
        >
          <Button className="h-[40px] rounded-full" type="outline" size="sm">
            Connect Wallet
          </Button>
        </Popover>
      )}
    </div>
  );
};
