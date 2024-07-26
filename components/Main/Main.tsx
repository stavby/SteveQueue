import React, { useState } from 'react';
import { useAuthentication } from '../../code/hooks/useAuthentication';
import { AuthWebView } from '../AuthWebView/AuthWebView';
import { SteveQueue } from '../SteveQueue/SteveQueue';

export const Main = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const { tokenExpired, isAuthenticating, authenticate } = useAuthentication();

  return (
    <>
      {isAuthenticating && (
        <AuthWebView
          onTokenResult={authenticate}
          isAuthenticating={isAuthenticating}
          setIsFirstLogin={setIsFirstLogin}
        />
      )}
      {!isFirstLogin && <SteveQueue tokenExpired={tokenExpired} isAuthenticating={isAuthenticating} />}
    </>
  );
};
