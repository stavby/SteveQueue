import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenResult } from '../../types';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { sha256 } from 'js-sha256';

export const CLIENT_ID = '7cb51e6ec07847b6ac9ecd0a3f2ee49f';

export const getToken = async () => await AsyncStorage.getItem('@SteveQueue:token');

export const getRefreshToken = async () => await AsyncStorage.getItem('@SteveQueue:refresh_token');

export const updateToken = async (tokenResult: TokenResult) => {
  const expiresIn = new Date().valueOf() + tokenResult.expires_in * 1000;
  console.log('Updating local token - expires: ' + new Date(expiresIn));
  await AsyncStorage.multiSet([
    ['@SteveQueue:token_expiresIn', expiresIn.toString()],
    ['@SteveQueue:token', tokenResult.access_token],
    ['@SteveQueue:refresh_token', tokenResult.refresh_token],
  ]);
};

export const getIsTokenUpToDate = async () => {
  const expiresIn = await AsyncStorage.getItem('@SteveQueue:token_expiresIn');
  console.log(
    `Checking if token is up to date - expires ${expiresIn ? new Date(parseInt(expiresIn)).toString() : 'empty'}`,
  );

  return !!expiresIn && parseInt(expiresIn) > new Date().valueOf();
};

const base64UrlEncode = (buffer: Buffer): string =>
  buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const generateCodeVerifier = (): string => {
  const randomBytes = new Uint8Array(64);
  crypto.getRandomValues(randomBytes);

  return base64UrlEncode(Buffer.from(randomBytes));
};

export const generateCodeChallenge = (codeVerifier: string): string => {
  const hashBuffer = sha256.arrayBuffer(codeVerifier);
  return base64UrlEncode(Buffer.from(hashBuffer));
};
