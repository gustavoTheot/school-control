import axios from 'axios';

export function isLikelyNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return !error.response;
}
