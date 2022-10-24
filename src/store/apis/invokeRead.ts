import { createApi } from '@reduxjs/toolkit/query/react';
import { base64ToScriptHash, base64ToString } from 'utils/convertors';
import { invokeReadBaseQuery } from 'utils/queries';

export const invokeReadApi = createApi({
  reducerPath: 'invokeReadApi',
  baseQuery: invokeReadBaseQuery(),
  endpoints: builder => ({
    getTokenSymbol: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'symbol',
      }),
      transformResponse: (result: any) => base64ToString(result[0].value),
    }),

    getTokenDecimals: builder.query<number, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'decimals',
      }),
      transformResponse: (result: any) => Number(result[0].value),
    }),

    getLpBaseToken: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getBaseToken',
      }),
      transformResponse: (result: any) => base64ToScriptHash(result[0].value),
    }),

    getLpQuoteToken: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getQuoteToken',
      }),
      transformResponse: (result: any) => base64ToScriptHash(result[0].value),
    }),

    getLpInvestorBaseTokenAmount: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getInvestorBaseTokenAmount',
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpInvestorQuoteTokenAmount: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getInvestorQuoteTokenAmount',
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpOriginalBaseTokenAmount: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getOriginalBaseTokenAmount',
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpOriginalQuoteTokenAmount: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getOriginalQuoteTokenAmount',
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpAverageDepositPrice: builder.query<string, { scriptHash: string; decimals: number }>({
      query: ({ scriptHash, decimals }) => ({
        scriptHash,
        operation: 'getAverageDepositPrice',
        args: [{ type: 'Integer', value: decimals }],
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpInvestorTokenValue: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getInvestorTokenValue',
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpFundValue: builder.query<string, { scriptHash: string }>({
      query: ({ scriptHash }) => ({
        scriptHash,
        operation: 'getFundValue',
      }),
      transformResponse: (result: any) => result[0].value,
    }),

    getLpCollateralRatio: builder.query<string, { scriptHash: string; decimals: number }>({
      query: ({ scriptHash, decimals }) => ({
        scriptHash,
        operation: 'getCollateralRatio',
        args: [{ type: 'Integer', value: decimals }],
      }),
      transformResponse: (result: any) => result[0].value,
    }),
  }),
});

export const {
  useGetTokenSymbolQuery,
  useGetTokenDecimalsQuery,
  useGetLpBaseTokenQuery,
  useGetLpQuoteTokenQuery,
  useGetLpInvestorBaseTokenAmountQuery,
  useGetLpInvestorQuoteTokenAmountQuery,
  useGetLpOriginalBaseTokenAmountQuery,
  useGetLpOriginalQuoteTokenAmountQuery,
  useGetLpAverageDepositPriceQuery,
  useGetLpInvestorTokenValueQuery,
  useGetLpFundValueQuery,
  useGetLpCollateralRatioQuery,
} = invokeReadApi;
