import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import WebView from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { CLIENT_ID } from '../../code/apiUtils/Authentication';
import { ACCOUNTS_API_URL } from '../../code/apiUtils/Urls';
import { TokenResult } from '../../types';
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation';
import BackIcon from '../../assets/back.svg';

const REDIRECT_URL = 'http://www.blankwebsite.com'; // Just chose a site that will take the least amount of time to load
const SPOTIFY_AUTH_URL = `${ACCOUNTS_API_URL}/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URL}&scope=user-modify-playback-state user-read-playback-state`;

const SIDE_ICON_SIZE = 25;
const ICON_MARGIN = 5;
const ICON_BORDER_SIZE = 2;
const SIDE_DUMMY_SIZE = SIDE_ICON_SIZE + ICON_MARGIN * 2 + ICON_BORDER_SIZE * 2;

interface AuthWebViewPros {
  onTokenResult: (tokenResult: TokenResult) => void;
  isAuthenticating: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoggedIn: boolean;
}

export const AuthWebView = ({ onTokenResult, setIsLoggedIn, isLoggedIn }: AuthWebViewPros) => {
  const webView = useRef<WebView>(null);
  const [url, setUrl] = useState(SPOTIFY_AUTH_URL);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggingIn = useMemo(() => new RegExp(`^${ACCOUNTS_API_URL}\/[a-z]{2}\/login`).test(url), [url]);

  useEffect(() => {
    if (isLoggingIn) {
      setIsLoggedIn(false);
    }
  }, [isLoggingIn]);

  const handleLoad = (syntheticEvent: WebViewNavigationEvent) => {
    const { nativeEvent } = syntheticEvent;

    setUrl(nativeEvent.url);
    const url = new URL(nativeEvent.url);
    if (url.origin === REDIRECT_URL) {
      setIsLoading(true);
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

      setIsLoading(false);
      setIsLoggedIn(true);
      onTokenResult(tokenResult);
    } else {
      setIsLoading(nativeEvent.loading);
    }
  };

  return (
    <View style={{ ...styles.container, display: isLoggedIn ? 'none' : 'flex' }}>
      <View style={styles.topPart}>
        <View style={styles.iconContainer}>
          <BackIcon
            style={styles.sideIcon}
            title='search'
            color='black'
            onPress={() => {
              setIsLoading(true);
              setUrl(SPOTIFY_AUTH_URL);
            }}
            width={SIDE_ICON_SIZE}
            height={SIDE_ICON_SIZE}
          />
        </View>
        <Text style={styles.text}>Please login to Spotify to use Steve Queue</Text>
      </View>
      <WebView
        source={{ uri: url }}
        onLoad={handleLoad}
        userAgent='Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36'
        style={{ display: isLoading ? 'none' : 'flex' }}
        ref={webView}
      />
      <LoadingAnimation isLoading={isLoading} text='Loading ... :)' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topPart: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 15,
  },
  iconContainer: {
    width: SIDE_DUMMY_SIZE,
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: '#777777',
    padding: ICON_MARGIN,
  },
  sideIcon: {
    backgroundColor: '#777777',
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
