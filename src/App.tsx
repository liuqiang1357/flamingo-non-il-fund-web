import { FC, useEffect, useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ErrorHandlder } from 'components/shared/ErrorHandler';
import { useDispatch } from 'hooks/redux';
import { initWallets } from 'store/slices/walletStates';
import { Index } from './components/index';

export const App: FC = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    document.scrollingElement?.scrollTo(0, 0);
  }, [location.pathname]);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(initWallets()).unwrap();
    })();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route index element={<Index />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ErrorHandlder />
    </>
  );
};
