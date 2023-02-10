import axios from 'axios';
import { getToken } from './Authentication';
import { API_URL } from './Urls';

export const skip = async () => {
  try {
    await axios.post(
      `${API_URL}/v1/me/player/next`,
      {},
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    const errorText = 'Skip request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }

    throw new Error('Error, please try again');
  }
};

export const pause = async () => {
  try {
    await axios.put(
      `${API_URL}/v1/me/player/pause`,
      {},
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    const errorText = 'Pause request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }

    throw new Error('Error, please try again');
  }
};

export const seek = async (position: number) => {
  try {
    await axios.put(
      `${API_URL}/v1/me/player/seek?position_ms=${position}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    const errorText = 'Seek request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }

    throw new Error('Error, please try again');
  }
};
