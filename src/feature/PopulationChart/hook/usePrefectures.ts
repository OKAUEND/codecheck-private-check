import { selector, useRecoilValue } from 'recoil';
import { Prefectures } from '@/src/types/resas';
import { prefecturesQuery } from '@/src/feature/PopulationChart/api/prefecturesQuery';

const prefectures = selector<Prefectures[]>({
  key: 'data-flow/prefectures',
  get: async () => {
    const resasRes = await prefecturesQuery();
    return resasRes.result;
  },
});

export const usePrefectures = () => {
  return useRecoilValue(prefectures);
};
