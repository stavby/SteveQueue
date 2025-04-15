import { getToken } from './Authentication';

export const getAuthorizationHeader = async () => ({
  headers: {
    Authorization: `Bearer ${await getToken()}`,
    'Content-Type': 'application/json',
  },
});
