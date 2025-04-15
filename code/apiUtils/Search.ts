import axios, { AxiosResponse } from 'axios';
import { SearchResults } from '../../types';
import { SongNotFoundError } from '../errors/SongNotFoundError';
import { getAuthorizationHeader } from './General';
import { API_URL } from './Urls';

export const getSongUri = async (name: string) => {
  let searchResponse: AxiosResponse;
  try {
    searchResponse = await axios.get(`${API_URL}/v1/search?type=track&q=${name}`, await getAuthorizationHeader());
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    console.error('Search request was not successful\n' + error + '\n' + JSON.stringify(error.response?.data));
    return;
  }
  const results: SearchResults = searchResponse.data;

  if (results.tracks.total === 0) {
    throw new SongNotFoundError();
  }

  return results.tracks.items[0].uri;
};
