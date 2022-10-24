import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Input } from 'antd';
import { FC, useState } from 'react';
import { Button } from 'components/base/Button';
import { Container } from 'components/shared/Container';
import { Page } from 'components/shared/Page';
import {
  useAddLiquidityAndStakeMutation,
  useRefundAndRemoveLiquidityMutation,
} from 'store/apis/invoke';
import {
  useGetLpAverageDepositPriceQuery,
  useGetLpBaseTokenQuery,
  useGetLpCollateralRatioQuery,
  useGetLpFundValueQuery,
  useGetLpInvestorBaseTokenAmountQuery,
  useGetLpInvestorQuoteTokenAmountQuery,
  useGetLpInvestorTokenValueQuery,
  useGetLpOriginalBaseTokenAmountQuery,
  useGetLpOriginalQuoteTokenAmountQuery,
  useGetLpQuoteTokenQuery,
  useGetTokenDecimalsQuery,
  useGetTokenSymbolQuery,
} from 'store/apis/invokeRead';
import { useConnectedWalletState } from 'store/slices/walletStates';
import { integerToDecimal } from 'utils/convertors';
import { formatNumber } from 'utils/formatters';

export const Index: FC = () => {
  const [scriptHash, setScriptHash] = useState('0x7b8afe03e8133c646552a8e205c6b77a6c338f17');

  const { currentData: baseTokenHash } = useGetLpBaseTokenQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: baseTokenSymbol } = useGetTokenSymbolQuery(
    baseTokenHash != undefined ? { scriptHash: baseTokenHash } : skipToken,
  );

  const { currentData: baseTokenDecimals } = useGetTokenDecimalsQuery(
    baseTokenHash != undefined ? { scriptHash: baseTokenHash } : skipToken,
  );

  const { currentData: quoteTokenHash } = useGetLpQuoteTokenQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: quoteTokenSymbol } = useGetTokenSymbolQuery(
    quoteTokenHash != undefined ? { scriptHash: quoteTokenHash } : skipToken,
  );

  const { currentData: quoteTokenDecimals } = useGetTokenDecimalsQuery(
    quoteTokenHash != undefined ? { scriptHash: quoteTokenHash } : skipToken,
  );

  const { currentData: investorBaseTokenAmount } = useGetLpInvestorBaseTokenAmountQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: investorQuoteTokenAmount } = useGetLpInvestorQuoteTokenAmountQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: originalBaseTokenAmount } = useGetLpOriginalBaseTokenAmountQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: originalQuoteTokenAmount } = useGetLpOriginalQuoteTokenAmountQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: averageDepositPrice } = useGetLpAverageDepositPriceQuery(
    scriptHash !== '' && quoteTokenDecimals != undefined
      ? { scriptHash, decimals: quoteTokenDecimals }
      : skipToken,
  );

  const { currentData: investorTokenValue } = useGetLpInvestorTokenValueQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: fundValue } = useGetLpFundValueQuery(
    scriptHash !== '' ? { scriptHash } : skipToken,
  );

  const { currentData: collateralRatioE8 } = useGetLpCollateralRatioQuery(
    scriptHash !== '' ? { scriptHash, decimals: 8 } : skipToken,
  );

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
            className="ml-[20px] w-[480px]"
            value={scriptHash}
            onChange={event => setScriptHash(event.target.value)}
          />
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Base Token:</div>
          <div className="ml-[20px]">
            {baseTokenSymbol} {baseTokenHash}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Quote Token:</div>
          <div className="ml-[20px]">
            {quoteTokenSymbol} {quoteTokenHash}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Investor Base Token Amount:</div>
          <div className="ml-[20px]">
            {investorBaseTokenAmount != undefined &&
              baseTokenDecimals != undefined &&
              formatNumber(integerToDecimal(investorBaseTokenAmount, baseTokenDecimals))}{' '}
            {baseTokenSymbol}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Investor Quote Token Amount:</div>
          <div className="ml-[20px]">
            {investorQuoteTokenAmount != undefined &&
              quoteTokenDecimals != undefined &&
              formatNumber(integerToDecimal(investorQuoteTokenAmount, quoteTokenDecimals))}{' '}
            {quoteTokenSymbol}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Original Base Token Amount:</div>
          <div className="ml-[20px]">
            {originalBaseTokenAmount != undefined &&
              baseTokenDecimals != undefined &&
              formatNumber(integerToDecimal(originalBaseTokenAmount, baseTokenDecimals))}{' '}
            {baseTokenSymbol}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Original Quote Token Amount:</div>
          <div className="ml-[20px]">
            {originalQuoteTokenAmount != undefined &&
              quoteTokenDecimals != undefined &&
              formatNumber(integerToDecimal(originalQuoteTokenAmount, quoteTokenDecimals))}{' '}
            {quoteTokenSymbol}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Average Deposit Price:</div>
          <div className="ml-[20px]">
            {averageDepositPrice != undefined &&
              baseTokenDecimals != undefined &&
              quoteTokenDecimals != undefined &&
              formatNumber(
                integerToDecimal(averageDepositPrice, 2 * quoteTokenDecimals - baseTokenDecimals),
              )}{' '}
            {quoteTokenSymbol != undefined &&
              baseTokenSymbol != undefined &&
              `${quoteTokenSymbol}/${baseTokenSymbol}`}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Investor Token Value:</div>
          <div className="ml-[20px]">
            {investorTokenValue != undefined &&
              quoteTokenDecimals != undefined &&
              formatNumber(integerToDecimal(investorTokenValue, quoteTokenDecimals))}{' '}
            {quoteTokenSymbol}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Fund Value:</div>
          <div className="ml-[20px]">
            {fundValue != undefined &&
              quoteTokenDecimals != undefined &&
              formatNumber(integerToDecimal(fundValue, quoteTokenDecimals))}{' '}
            {quoteTokenSymbol}
          </div>
        </div>

        <div className="mt-[20px] flex items-center">
          <div>Collateral Ratio:</div>
          <div className="ml-[20px]">
            {collateralRatioE8 != undefined &&
              formatNumber(integerToDecimal(collateralRatioE8, 8), { asPercentage: true })}
          </div>
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
