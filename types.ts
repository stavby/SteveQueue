export interface TokenResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface CodeResult {
  code: string;
}

export enum LANGUAGE {
  HEBREW = 'he-IL',
  ENGLISH = 'en-US',
}

export interface SearchResults {
  tracks: {
    total: number;
    items: Song[];
  };
}

interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
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
  device: Device;
}
