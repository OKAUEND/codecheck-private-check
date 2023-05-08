import { ResasResponse } from '@/src/types/resas';

export const fetchRESAS = async <T>(url: string) => {
  const API_KEY = import.meta.env.VITE_RESAS_API_KEY;
  const res = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`${res.status}`);
  }

  const data: ResasResponse<T> = await res.json();

  if (typeof data === 'number') {
    throw new Error(`${data}`);
  }

  if (!('result' in data)) {
    if (data.message === null) {
      throw new Error(`429 Many Request`);
    }
    throw new Error(`${data.statusCode} ${data.message}`);
  }

  return data;
};
