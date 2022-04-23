export class NotPremiumError extends Error {
  constructor() {
    super('Account must be premium to use Steve Queue, sorry!');
  }
}
