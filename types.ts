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
