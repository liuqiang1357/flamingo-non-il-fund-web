import { createApi } from '@reduxjs/toolkit/query/react';
import { nodeBaseQuery } from 'utils/queries';

export const nodeApi = createApi({
  reducerPath: 'nodeApi',
  baseQuery: nodeBaseQuery(),
  endpoints: builder => ({
    getApplicationLog: builder.query<unknown, { transactionHash: string }>({
      query: ({ transactionHash }) => ({
        method: 'getapplicationlog',
        params: [transactionHash],
      }),
    }),
  }),
});

export const { useGetApplicationLogQuery } = nodeApi;
