import { message } from 'antd';
import { remove } from 'lodash-es';
import { FC, useEffect, useRef } from 'react';
import { usePageVisibility } from 'react-page-visibility';
import { useDispatch } from 'hooks/redux';
import { clearError, registerErrorHandler, useLastError } from 'store/slices/errors';
import { BaseError } from 'utils/errors';

export const ErrorHandlder: FC = () => {
  const visibleLocalMessages = useRef<string[]>([]);

  const error = useLastError();
  const pageVisible = usePageVisibility();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(registerErrorHandler());
  }, [dispatch]);

  useEffect(() => {
    setTimeout(async () => {
      if (error) {
        dispatch(clearError(error));
        if (error instanceof BaseError) {
          if (error.expose) {
            const localMessage = error.getLocalMessage();
            if (localMessage && pageVisible) {
              if (!visibleLocalMessages.current.includes(localMessage)) {
                visibleLocalMessages.current.push(localMessage);
                await message.error(localMessage);
                remove(visibleLocalMessages.current, item => item === localMessage);
              }
            }
            error.printTraceStack();
          }
          return;
        }
        console.error(error);
      }
    });
  }, [error, pageVisible, dispatch]);

  return <></>;
};
