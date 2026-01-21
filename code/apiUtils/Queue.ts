import axios from 'axios';
import { PlaybackState, Queue } from '../../types';
import { NoActiveDeviceError } from '../errors/NoActiveDeviceError';
import { NotPremiumError } from '../errors/NotPremiumError';
import { getAuthorizationHeader } from './General';
import { pause, seek, skip } from './Player';
import { API_URL } from './Urls';
import { log } from '../utils/logger';

export const addSongToQueue = async (uri: string) => {
  try {
    await axios.post(`${API_URL}/v1/me/player/queue?uri=${uri}`, {}, await getAuthorizationHeader());
  } catch (error) {
    const errorText = 'Add to queue request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
      log(errorText);
      throw new Error('Error, please try again');
    }

    const errorLog = errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data');
    console.error(errorLog);
    if ('NO_ACTIVE_DEVICE' === error.response?.data?.error?.reason) {
      throw new NoActiveDeviceError();
    } else if ('PREMIUM_REQUIRED' === error.response?.data?.error?.reason) {
      throw new NotPremiumError();
    } else {
      log(errorLog);
      throw new Error('Error, please try again');
    }
  }
};

/*
  Why do we move a certain song to front and not just take the last song in queue (for the play next feature)?
  In Spoopify's API, the actual queue and the next songs in the playlist are part of the same queue, so the last song
  in the queue that we get is the last song in the playlist, and we don't want to add the whole playlist to the queue...
  So we assume that the specifed song as the last in the (actual) queue, and then move it to front!
*/
export const moveSongToFront = async (songUri: string) => {
  let queue = await getQueue();

  const currentTrackState = await getCurrentTrackState();

  let songInQueue = queue.queue.find((song) => song.uri === songUri);
  let retries = 3;
  while (!songInQueue && retries > 0) {
    log(`Song not found in queue, retrying to get queue again... (${retries} retries left)`, 'warn');
    // sometimes Spotify's API lags and the song is not yet in the queue right after adding it
    await new Promise<void>((resolve) => setTimeout(resolve, 500));
    queue = await getQueue();
    songInQueue = queue.queue.find((song) => song.uri === songUri);
    retries--;
  }

  if (!songInQueue) {
    log(
      `Song was not found in queue after addition -\nWanted song: ${songUri}\nCurrent queue: ${JSON.stringify(queue.queue)}`,
    );
    throw new Error('Something went wrong, please try again.');
  }

  const songIndex = queue.queue.findIndex((song) => song.uri === songUri);
  const queueUntilSong = [currentTrackState.item, songInQueue, ...queue.queue.slice(0, songIndex)];
  if (queueUntilSong.length === 2) {
    return;
  }

  if (currentTrackState.is_playing) {
    await pause();
  }

  for (const song of queueUntilSong) {
    await addSongToQueue(song.uri);
  }

  const skipRequests: Promise<void>[] = queueUntilSong.map(skip);
  await Promise.all(skipRequests); // skip order is not important so they can all be sent at the same time

  !currentTrackState.is_playing && (await pause());
  currentTrackState.progress_ms && (await seek(currentTrackState.progress_ms));
};

const getQueue = async () => {
  try {
    const res = await axios.get(`${API_URL}/v1/me/player/queue`, await getAuthorizationHeader());
    return res.data as Queue;
  } catch (error) {
    const errorText = 'Get queue request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }
    log(errorText);
    throw new Error('Error, please try again');
  }
};

const getCurrentTrackState = async (): Promise<PlaybackState> => {
  try {
    const res = await axios.get(`${API_URL}/v1/me/player`, await getAuthorizationHeader());
    const { is_playing, progress_ms, item, device } = res.data;
    return { is_playing, progress_ms, item, device };
  } catch (error) {
    const errorText = 'Get playback state request was not successful\n' + error;
    if (!axios.isAxiosError(error)) {
      console.error(errorText);
    } else {
      console.error(errorText + '\n' + JSON.stringify(error.response?.data ?? 'no data'));
    }

    log(errorText);
    throw new Error('Error, please try again');
  }
};
