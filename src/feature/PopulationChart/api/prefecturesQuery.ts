import { fetchRESAS } from '@/src/utile/fetch';
import { Prefectures } from '@/src/types/resas';

export const prefecturesQuery = async () => {
  const res = await fetchRESAS<Prefectures[]>(
    'https://opendata.resas-portal.go.jp/api/v1/prefectures'
  );
  return res;
};
