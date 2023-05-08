import { fetchRESAS } from '@/src/utile/fetch';
import { Populations } from '@/src/types/resas';

export const populationQuery = async (query: string) => {
  const res = await fetchRESAS<Populations>(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?${query}&cityCode=-`
  );

  return res.result;
};
