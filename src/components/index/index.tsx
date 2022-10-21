import { Input } from 'antd';
import { FC, useState } from 'react';
import { Button } from 'components/base/Button';
import { Container } from 'components/shared/Container';
import { Page } from 'components/shared/Page';
import {
  useAddLiquidityAndStakeMutation,
  useRefundAndRemoveLiquidityMutation,
} from 'store/apis/invoke';
import { useConnectedWalletState } from 'store/slices/walletStates';

export const Index: FC = () => {
  const [scriptHash, setScriptHash] = useState('');

  const walletState = useConnectedWalletState();

  const [addLiquidityAndStakeMutation, { isLoading: addLoading }] =
    useAddLiquidityAndStakeMutation();

  const addLiquidityAndStake = async () => {
    if (!walletState) {
      return;
    }
    await addLiquidityAndStakeMutation({ address: walletState.address, scriptHash }).unwrap();
  };

  const [refundAndRemoveLiquidityMutation, { isLoading: refundLoading }] =
    useRefundAndRemoveLiquidityMutation();

  const refundAndRemoveLiquidity = async () => {
    if (!walletState) {
      return;
    }
    await refundAndRemoveLiquidityMutation({ address: walletState.address, scriptHash }).unwrap();
  };

  return (
    <Page contentClassName="pt-[20px]">
      <Container>
        <div className="flex items-center">
          <div>Script Hash:</div>
          <Input
            className="ml-[20px] w-[400px]"
            value={scriptHash}
            onChange={event => setScriptHash(event.target.value)}
          />
        </div>

        <div className="mt-[20px] flex items-center">
          <Button
            type="outline"
            size="sm"
            color="green"
            disabled={addLoading}
            onClick={addLiquidityAndStake}
          >
            AddLiquidityAndStake
          </Button>
          <Button
            className="ml-[20px]"
            type="outline"
            size="sm"
            color="red"
            disabled={refundLoading}
            onClick={refundAndRemoveLiquidity}
          >
            RefundAndRemoveLiquidity
          </Button>
        </div>
      </Container>
    </Page>
  );
};
