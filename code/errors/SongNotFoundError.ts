export class SongNotFoundError extends Error {
  constructor() {
    super('Song not found :(');
  }
}
