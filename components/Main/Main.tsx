import React, { useEffect, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { isTokenUpToDate, updateToken } from '../../code/apiUtils/Authentication';
import { TokenResult } from '../../types';
import { AuthWebView } from '../AuthWebView/AuthWebView';
import { SteveQueue } from '../SteveQueue/SteveQueue';

export const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    updateAuthenticationStatus();
  }, []);

  const updateAuthenticationStatus = async () => setIsAuthenticated(await isTokenUpToDate());
  const authenticate = async (tokenResult: TokenResult) => {
    await updateToken(tokenResult);
    setIsAuthenticated(true);
  };
  const tokenExpired = () => {
    setIsAuthenticated(false);
    Snackbar.show({
      text: 'Token expired, please wait for authentication and try again',
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: 'red',
    });
  };

  return isAuthenticated ? <SteveQueue tokenExpired={tokenExpired} /> : <AuthWebView onTokenResult={authenticate} />;
};
