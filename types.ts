export interface TokenResult {
  access_token: string;
  expires_in: number;
}

export enum LANGUAGE {
  HEBREW = 'HEBREW',
  ENGLISH = 'ENGLISH',
}

export interface SearchResults {
  tracks: {
    total: number;
    items: Song[];
  };
}

export interface Song {
  album: { name: string };
  name: string;
  id: string;
  uri: string;
}

export interface Queue {
  currently_playing: Song;
  queue: Song[];
}

export interface PlaybackState {
  item: Song;
  progress_ms: number;
  is_playing: boolean;
}
