import { BaseJsonRpcTransport, RequestArguments, StandardErrorCodes } from '@neongd/json-rpc';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import delay from 'delay';
import { Dispatch } from 'store';
import { nodeApi } from 'store/apis/node';
import { publishError } from 'store/slices/errors';
import { ensureWalletReady } from 'store/slices/walletStates';
import { FURA_URL, NODE_URL } from './configs';
import { BackendError } from './errors';
import { InvokeParams } from './wallets/types';

export function nodeBaseQuery(): BaseQueryFn<RequestArguments> {
  return async (request, { dispatch }) => {
    const api = new BaseJsonRpcTransport(NODE_URL);
    try {
      const result = await api.request(request);
      return { data: result };
    } catch (error: any) {
      let code = BackendError.Codes.UnknownError;
      if (error.code === StandardErrorCodes.NetworkError) {
        code = BackendError.Codes.NetworkError;
      } else if (error.code === -100) {
        code = BackendError.Codes.NotFound;
      }
      const finalError = new BackendError(error.message, { cause: error, data: error.data, code });
      dispatch(publishError(finalError));
      return { error: finalError };
    }
  };
}

export function furaBaseQuery(): BaseQueryFn<RequestArguments> {
  return async (request, { dispatch }) => {
    const api = axios.create({ baseURL: FURA_URL });
    try {
      const response = await api.post('/', request);
      if (response.data.error == undefined) {
        return { data: response.data.result };
      }
      let code = BackendError.Codes.UnknownError;
      if (response.data.error.code === -100) {
        code = BackendError.Codes.NotFound;
      }
      const finalError = new BackendError(response.data.error.message, {
        cause: response.data.error,
        data: response.data.error.data,
        code,
      });
      dispatch(publishError(finalError));
      return { error: finalError };
    } catch (error: any) {
      const finalError = new BackendError(error.message, {
        cause: error,
        code: BackendError.Codes.NetworkError,
      });
      dispatch(publishError(finalError));
      return { error: finalError };
    }
  };
}

export function invokeReadBaseQuery(): BaseQueryFn<InvokeParams> {
  return async (params, api, extraOptions) => {
    const { data, error } = await nodeBaseQuery()(
      {
        method: 'invokefunction',
        params: [
          params.scriptHash,
          params.operation,
          params.args ?? [],
          (params.signers ?? []).map(signer => ({
            account: signer.account,
            scopes: signer.scopes,
            allowedcontracts: signer.allowedContracts,
            allowedgroups: signer.allowedGroups,
          })),
        ],
      },
      api,
      extraOptions,
    );
    if (error == undefined) {
      if ((data as any).exception == undefined) {
        return { data: (data as any).stack };
      }
      const finalError = new BackendError((data as any).exception, {
        cause: data,
        code: BackendError.Codes.BadRequest,
      });
      api.dispatch(publishError(finalError));
      return { error: finalError };
    }
    return { error };
  };
}

export function invokeBaseQuery(): BaseQueryFn<InvokeParams & { waitConfirmed?: boolean }> {
  return async ({ waitConfirmed, ...params }, { dispatch }) => {
    try {
      const { wallet } = await (dispatch as Dispatch)(ensureWalletReady()).unwrap();
      const transactionHash = await wallet.invoke(params);

      if (waitConfirmed === true) {
        let retryCount = 0;
        for (;;) {
          try {
            const { unsubscribe, unwrap } = dispatch(
              nodeApi.endpoints.getApplicationLog.initiate(
                { transactionHash },
                { forceRefetch: true },
              ),
            );
            try {
              await unwrap();
              break;
            } finally {
              unsubscribe();
            }
          } catch (error) {
            if (error instanceof BackendError && error.code === BackendError.Codes.NotFound) {
              error.expose = false;
              await delay(5000 * 1.2 ** retryCount);
              retryCount += 1;
              continue;
            }
            throw error;
          }
        }
      }
      return { data: transactionHash };
    } catch (error: any) {
      dispatch(publishError(error));
      return { error };
    }
  };
}
