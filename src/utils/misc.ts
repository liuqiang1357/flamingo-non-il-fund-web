import {
  AsyncThunk,
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  createAsyncThunk as createReduxAsyncThunk,
  SerializedError,
} from '@reduxjs/toolkit';
import { $enum } from 'ts-enum-util';
import { Dispatch, State } from 'store';

// eslint-disable-next-line no-restricted-syntax
export const DEPRECATED_NULL = null;

export function mapEnumToObject<E extends string | number, R>(
  e: Record<string, E>,
  iterator: (value: E) => R,
): Record<E, R> {
  return $enum(e)
    .getValues()
    .reduce((acc, cur) => {
      acc[cur] = iterator(cur);
      return acc;
    }, {} as Record<E, R>);
}

export function createAsyncThunk<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<
    Returned,
    ThunkArg,
    { state: State; dispatch: Dispatch }
  >,
  options?: AsyncThunkOptions<ThunkArg, Record<string, any>>,
): AsyncThunk<Returned, ThunkArg, Record<string, any>> {
  return createReduxAsyncThunk(typePrefix, payloadCreator, {
    serializeError: (error: unknown): SerializedError => error as SerializedError,
    ...options,
  });
}
