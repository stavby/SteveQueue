import React, { useEffect, useState } from 'react';
import WebView from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import { CLIENT_ID } from '../../code/apiUtils/Authentication';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { TokenResult } from '../../types';
import { ACCOUNTS_API_URL } from '../../code/apiUtils/Urls';
import Snackbar from 'react-native-snackbar';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation';

const REDIRECT_URL = 'https://google.com';
const REDIRECT_URL_FULL = 'https://www.google.com';
const SPOTIFY_AUTH_URL = `${ACCOUNTS_API_URL}/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URL}&scope=user-modify-playback-state user-read-playback-state`;

interface AuthWebViewPros {
  onTokenResult: (tokenResult: TokenResult) => void;
  isAuthenticating: boolean;
  setIsFirstLogin: (isFirstLogin: boolean) => void;
}

export const AuthWebView = ({ onTokenResult, isAuthenticating, setIsFirstLogin }: AuthWebViewPros) => {
  const [url, setUrl] = useState(SPOTIFY_AUTH_URL);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggingIn = new RegExp(`^${ACCOUNTS_API_URL}\/[a-z]{2}\/login`).test(url);

  useEffect(() => {
    setIsFirstLogin(isLoggingIn);
  }, [isLoggingIn]);

  const handleLoad = (syntheticEvent: WebViewNavigationEvent) => {
    const { nativeEvent } = syntheticEvent;

    setUrl(nativeEvent.url);
    const url = new URL(nativeEvent.url);
    if (url.origin === REDIRECT_URL_FULL) {
      setIsLoading(true);
      if (!nativeEvent.loading) {
        const tokenResult = hashToObject(url.hash) as TokenResult;

        if (!tokenResult.access_token) {
          console.error('Access token was not returned: ' + nativeEvent.url);
          setUrl(SPOTIFY_AUTH_URL);
          Snackbar.show({
            text: 'Something went wrong, please try again :(',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
          return;
        }

        onTokenResult(tokenResult);
      }
    } else {
      setIsLoading(nativeEvent.loading);
    }
  };

  return (
    <View style={{ ...styles.container, display: isLoggingIn ? 'flex' : 'none' }}>
      <WebView
        source={{ uri: url }}
        onLoad={handleLoad}
        userAgent='Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36'
        style={{ display: isLoading ? 'none' : 'flex' }}
      />
      <LoadingAnimation isLoading={isLoading} text='Loading ... :)' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const hashToObject = (hash: string) =>
  hash
    .substring(1)
    .split('&')
    .reduce(
      (object, item) => ({
        ...object,
        [item.substring(0, item.indexOf('='))]: item.substring(item.indexOf('=') + 1),
      }),
      {},
    );
