import AsyncStorage from '@react-native-community/async-storage';
import { TokenResult } from '../../types';

export const CLIENT_ID = '7cb51e6ec07847b6ac9ecd0a3f2ee49f';

export const getToken = async () => await AsyncStorage.getItem('@SteveQueue:token');

export const updateToken = async (tokenResult: TokenResult) => {
  const expiresIn = new Date().valueOf() + tokenResult.expires_in * 1000;
  console.log('Updating local token - expires: ' + new Date(expiresIn));
  await AsyncStorage.multiSet([
    ['@SteveQueue:token_expiresIn', expiresIn.toString()],
    ['@SteveQueue:token', tokenResult.access_token],
  ]);
};

export const getIsTokenUpToDate = async () => {
  const expiresIn = await AsyncStorage.getItem('@SteveQueue:token_expiresIn');

  return !!expiresIn && parseInt(expiresIn) > new Date().valueOf();
};
