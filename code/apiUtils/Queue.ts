import axios, { AxiosResponse } from 'axios';
import { NoActiveDeviceError } from '../errors/NoActiveDeviceError';
import { NotPremiumError } from '../errors/NotPremiumError';
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
    const errorText = 'Add to queue request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
      throw new Error('Error, please try again');
    }

    console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    if ('NO_ACTIVE_DEVICE' === error.response?.data?.error?.reason) {
      throw new NoActiveDeviceError();
    } else if ('PREMIUM_REQUIRED' === error.response?.data?.error?.reason) {
      throw new NotPremiumError();
    } else {
      throw new Error('Error, please try again');
    }
  }
};
