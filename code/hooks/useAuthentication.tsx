import axios from 'axios';
import { useEffect, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { TokenResult } from '../../types';
import { CLIENT_ID, getIsTokenUpToDate, getRefreshToken, updateToken } from '../apiUtils/Authentication';
import { ACCOUNTS_API_URL, REDIRECT_URL } from '../apiUtils/Urls';
import { log } from '../utils/logger';

export const useAuthentication = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!(await getIsTokenUpToDate())) {
        tokenExpired();
      }
    })();
  }, []);

  const authenticate = async (code: string, codeVerifier: string) => {
    const tokenResult = await axios.post<TokenResult>(
      `${ACCOUNTS_API_URL}/api/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URL,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier,
      }),
    );

    if (!tokenResult.data || !tokenResult.data.access_token) {
      log('Authentication failed: ' + JSON.stringify(tokenResult.data));
      Snackbar.show({
        text: 'Something went wrong, please try again :(',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      return;
    }

    await updateToken(tokenResult.data);
    setIsAuthenticating(false);
  };

  const tokenExpired = async () => {
    console.log('TOKEN EXPIRED CALLED');
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.log('no refresh token, authenticating...');
      setIsAuthenticating(true);
      return;
    }

    setIsRefreshing(true);
    const tokenResult = await axios.post<TokenResult>(
      `${ACCOUNTS_API_URL}/api/token`,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
      }),
    );

    if (!tokenResult.data || !tokenResult.data.access_token) {
      log('Refresh token failed: ' + JSON.stringify(tokenResult.data));
      setIsAuthenticating(true);
    } else {
      await updateToken(tokenResult.data);
    }

    setIsRefreshing(false);
  };

  return { isAuthenticating, authenticate, tokenExpired, isRefreshing };
};
