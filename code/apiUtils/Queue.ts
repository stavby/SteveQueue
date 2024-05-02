import axios from 'axios';
import { PlaybackState, Queue } from '../../types';
import { NoActiveDeviceError } from '../errors/NoActiveDeviceError';
import { NotPremiumError } from '../errors/NotPremiumError';
import { getToken } from './Authentication';
import { changeVolume, pause, seek, skip } from './Player';
import { API_URL } from './Urls';

export const addSongToQueue = async (uri: string) => {
  try {
    await axios.post(
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

export const moveSongToFront = async (songUri: string) => {
  const queue = await getQueue();
  const currentTrackState = await getCurrentTrackState();

  const songIndex = queue.queue.findIndex((song) => song.uri === songUri);
  const songInQueue = queue.queue.find((song) => song.uri === songUri);
  if (!songInQueue) {
    console.error('Song was not found in queue after addition');
    throw new Error('Something went wrong, please try again.');
  }
  const queueUntilSong = [currentTrackState.item, songInQueue, ...queue.queue.slice(0, songIndex)];
  if (queueUntilSong.length === 2) {
    return;
  }

  if (currentTrackState.is_playing) {
    await pause();
  }

  for(const [index, song] of queueUntilSong.entries()) {
    await addSongToQueue(song.uri);
    await skip();
    if (index !== queueUntilSong.length - 1) {
      await pause();
    } else {
      !currentTrackState.is_playing && await pause();
    }
  }
  currentTrackState.progress_ms && await seek(currentTrackState.progress_ms);
};

const getQueue = async () => {
  try {
    const res = await axios.get(`${API_URL}/v1/me/player/queue`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data as Queue;
  } catch (error) {
    const errorText = 'Get queue request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }

    throw new Error('Error, please try again');
  }
};

const getCurrentTrackState = async (): Promise<PlaybackState> => {
  try {
    const res = await axios.get(`${API_URL}/v1/me/player`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    const { is_playing, progress_ms, item, device } = res.data;
    return { is_playing, progress_ms, item, device };
  } catch (error) {
    const errorText = 'Get playback state request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }

    throw new Error('Error, please try again');
  }
};
