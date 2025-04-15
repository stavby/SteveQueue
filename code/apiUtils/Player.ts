import axios from 'axios';
import { getAuthorizationHeader } from './General';
import { API_URL } from './Urls';

const throwPlayerError = (error: Error, message: string) => {
  if (!axios.isAxiosError(error)) {
    console.error(message);
  } else {
    console.error(message + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
  }

  throw new Error('Error, please try again');
};

export const skip = async () => {
  try {
    await axios.post(`${API_URL}/v1/me/player/next`, {}, await getAuthorizationHeader());
  } catch (error) {
    const errorText = 'Skip request was not successful\n' + error;
    throwPlayerError(error as Error, errorText);
  }
};

export const pause = async () => {
  try {
    await axios.put(`${API_URL}/v1/me/player/pause`, {}, await getAuthorizationHeader());
  } catch (error) {
    const errorText = 'Pause request was not successful\n' + error;
    throwPlayerError(error as Error, errorText);
  }
};

export const seek = async (position: number) => {
  try {
    await axios.put(`${API_URL}/v1/me/player/seek?position_ms=${position}`, {}, await getAuthorizationHeader());
  } catch (error) {
    const errorText = 'Seek request was not successful\n' + error;
    throwPlayerError(error as Error, errorText);
  }
};
