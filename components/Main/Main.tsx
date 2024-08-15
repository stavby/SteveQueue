import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../code/hooks/useAuthentication';
import { AuthWebView } from '../AuthWebView/AuthWebView';
import { SteveQueue } from '../SteveQueue/SteveQueue';
import { getToken } from '../../code/apiUtils/Authentication';

export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { tokenExpired, isAuthenticating, authenticate } = useAuthentication();

  useEffect(() => {
    getToken().then((tokenResult) => setIsLoggedIn(Boolean(tokenResult)));
  }, []);

  return (
    <>
      {isAuthenticating && (
        <AuthWebView
          onTokenResult={authenticate}
          isAuthenticating={isAuthenticating}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
        />
      )}
      {isLoggedIn && <SteveQueue tokenExpired={tokenExpired} isAuthenticating={isAuthenticating} />}
    </>
  );
};
