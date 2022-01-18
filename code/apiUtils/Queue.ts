import axios, { AxiosResponse } from 'axios';
import { NoActiveDeviceError } from '../errors/NoActiveDeviceError';
import { getToken } from './Authentication';
import { API_URL } from './Urls';

export const addSongToQueue = async (uri: string) => {
  let addToQueueResponse: AxiosResponse;
  try {
    addToQueueResponse = await axios.post(
      `${API_URL}/v1/me/player/queue?uri=${uri}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    if ('NO_ACTIVE_DEVICE' === error.response?.data?.error?.reason) {
      throw new NoActiveDeviceError();
    }
    console.error('Add to queue request was not successful\n' + error + '\n' + JSON.stringify(error.response?.data));
    return;
  }
};
