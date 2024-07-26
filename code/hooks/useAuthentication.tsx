import { useState, useEffect } from 'react';
import { TokenResult } from '../../types';
import { getIsTokenUpToDate, updateToken } from '../apiUtils/Authentication';

export const useAuthentication = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    (async () => {
      if (!(await getIsTokenUpToDate())) {
        setIsAuthenticating(true);
      }
    })();
  }, []);

  const authenticate = async (tokenResult: TokenResult) => {
    setIsAuthenticating(true);
    await updateToken(tokenResult);
    setIsAuthenticating(false);
  };

  const tokenExpired = () => {
    setIsAuthenticating(true);
  };

  return { isAuthenticating, authenticate, tokenExpired };
};
