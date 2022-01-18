export class NoActiveDeviceError extends Error {
  constructor() {
    super('No active device found :(');
  }
}
