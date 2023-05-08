import {
  atom,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  waitForAll,
} from 'recoil';

import { Prefectures, PopulationInfo, Populations } from '@/src/types/resas';
import { populationQuery } from '@/src/feature/PopulationChart/api/populationQuery';
import { prefecturesMapToArray } from '@/src/feature/PopulationChart/hook/useSelectedPrefectures';

const prefQuery = 'prefCode=';

export type Categoryies = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

export const populationCategories: Categoryies[] = [
  '総人口',
  '年少人口',
  '生産年齢人口',
  '老年人口',
];

const selectedCategoryState = atom<string>({
  key: 'state/category',
  default: populationCategories[0],
});

const populationsQuery = selectorFamily<Populations, Prefectures>({
  key: 'data-flow/population-query',
  get: (prefecture) => async () => {
    const populations = await populationQuery(
      `${prefQuery}${prefecture.prefCode}`
    );
    return populations;
  },
});

const filteredPopulation = selectorFamily<PopulationInfo[], Prefectures>({
  key: 'data-flow/filtered-population',
  get:
    (prefecture) =>
    async ({ get }): Promise<PopulationInfo[]> => {
      const selectedCategory = get(selectedCategoryState);
      const populations = get(populationsQuery(prefecture));

      const filtered = populations.data.filter((population) => {
        return population.label === selectedCategory;
      })[0];

      const formmted = filtered.data.map((year) => {
        return { year: year.year, [prefecture.prefCode]: year.value };
      });

      return formmted;
    },
});

const populations = selector({
  key: 'data-flow/populations',
  get: ({ get }) => {
    const selectedPrefectures = get(prefecturesMapToArray);

    const populations = get(
      waitForAll(
        selectedPrefectures.map((prefecture) => {
          return filteredPopulation(prefecture);
        })
      )
    );

    if (populations.length === 0) {
      return [];
    }

    const formmtedInfo = populations.reduce((prevInfo, curreantInfo) => {
      const result = prevInfo.map((yearInfo) => {
        const curreantResult = curreantInfo.find(
          (curreanYearInfo) => curreanYearInfo.year === yearInfo.year
        );
        return { ...yearInfo, ...curreantResult };
      });
      return result;
    });

    return formmtedInfo;
  },
});

export const usePopulation = () => {
  return useRecoilValue(populations);
};

export const usePopulationCategories = () => {
  const selectedCategory = useRecoilValue(selectedCategoryState);

  const changeCategory = useRecoilCallback(({ set }) => (target: string) => {
    set(selectedCategoryState, () => target);
  });

  return [populationCategories, selectedCategory, changeCategory] as const;
};
