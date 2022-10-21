import { createApi } from '@reduxjs/toolkit/query/react';
import { addressToScriptHash } from 'utils/convertors';
import { invokeBaseQuery } from 'utils/queries';

export const invokeApi = createApi({
  reducerPath: 'invokeApi',
  baseQuery: invokeBaseQuery(),
  endpoints: builder => ({
    addLiquidityAndStake: builder.mutation<void, { address: string; scriptHash: string }>({
      query: ({ address, scriptHash }) => ({
        scriptHash,
        operation: 'addLiquidityAndStake',
        signers: [
          { account: scriptHash, scopes: 'CalledByEntry' },
          { account: addressToScriptHash(address), scopes: 'CalledByEntry' },
        ],
        waitConfirmed: true,
      }),
    }),

    refundAndRemoveLiquidity: builder.mutation<void, { address: string; scriptHash: string }>({
      query: ({ address, scriptHash }) => ({
        scriptHash,
        operation: 'refundAndRemoveLiquidity',
        signers: [
          { account: scriptHash, scopes: 'CalledByEntry' },
          { account: addressToScriptHash(address), scopes: 'CalledByEntry' },
        ],
        waitConfirmed: true,
      }),
    }),
  }),
});

export const { useAddLiquidityAndStakeMutation, useRefundAndRemoveLiquidityMutation } = invokeApi;
