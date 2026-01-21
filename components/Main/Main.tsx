import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../code/hooks/useAuthentication';
import { AuthWebView } from '../AuthWebView/AuthWebView';
import { SteveQueue } from '../SteveQueue/SteveQueue';
import { getToken } from '../../code/apiUtils/Authentication';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Main = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { tokenExpired, isAuthenticating, authenticate, isRefreshing } = useAuthentication();

  useEffect(() => {
    getToken().then((tokenResult) => setIsLoggedIn(Boolean(tokenResult)));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isAuthenticating && (
        <AuthWebView onCodeResult={authenticate} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      )}
      {isLoggedIn && <SteveQueue tokenExpired={tokenExpired} isAuthenticating={isAuthenticating || isRefreshing} />}
    </SafeAreaView>
  );
};
