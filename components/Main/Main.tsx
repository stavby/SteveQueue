import React, { useEffect, useState } from 'react';
import { isTokenUpToDate, updateToken } from '../../code/apiUtils/Authentication';
import { TokenResult } from '../../types';
import { AuthWebView } from '../AuthWebView/AuthWebView';
import { SteveQueue } from '../SteveQueue/SteveQueue';

export const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<string>();

  useEffect(() => {
    updateAuthenticationStatus();
  }, []);

  const updateAuthenticationStatus = async () => setIsAuthenticated(await isTokenUpToDate());
  const authenticate = async (tokenResult: TokenResult) => {
    await updateToken(tokenResult);
    setIsAuthenticated(true);
  };
  const tokenExpired = (pendingRequest: string) => {
    setPendingRequest(pendingRequest);
    setIsAuthenticated(false);
  };

  return isAuthenticated ? (
    <SteveQueue
      tokenExpired={tokenExpired}
      currentRequest={pendingRequest}
      resetCurrentRequest={() => setPendingRequest(undefined)}
    />
  ) : (
    <AuthWebView onTokenResult={authenticate} />
  );
};
