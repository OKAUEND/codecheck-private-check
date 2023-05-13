import {
  atom,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  waitForAll,
} from 'recoil';

import { Prefectures, PopulationInfo, Populations } from '@/src/types/resas';
import { populationQuery } from '@/src/feature/PopulationChart/api/populationQuery';

const prefQuery = 'prefCode=';

export type Categories = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

export const populationCategories: Categories[] = [
  '総人口',
  '年少人口',
  '生産年齢人口',
  '老年人口',
];

type SelectedsInfo = {
  selectedPrefs: Prefectures[];
  selectedCategory: string;
};

type SelectedInfo = {
  prefecture: Prefectures;
  selectedCategory: string;
};

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

const filteredPopulation = selectorFamily<PopulationInfo[], SelectedInfo>({
  key: 'data-flow/filtered-population',
  get:
    ({ prefecture, selectedCategory }) =>
    async ({ get }): Promise<PopulationInfo[]> => {
      // const selectedCategory = get(selectedCategoryState);
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

const formattedPopulations = selectorFamily<PopulationInfo[], SelectedsInfo>({
  key: 'data-flow/populations',
  get:
    ({ selectedPrefs, selectedCategory }) =>
    ({ get }) => {
      // const selectedPrefectures = get(prefecturesMapToArray);

      const populations = get(
        waitForAll(
          selectedPrefs.map((prefecture) => {
            return filteredPopulation({ prefecture, selectedCategory });
          })
        )
      );

      if (populations.length === 0) {
        return [];
      }

      const formateInfo = populations.reduce((prevInfo, currentInfo) => {
        const result = prevInfo.map((yearInfo) => {
          const currentResult = currentInfo.find(
            (currentYearInfo) => currentYearInfo.year === yearInfo.year
          );
          return { ...yearInfo, ...currentResult };
        });
        return result;
      });

      return formateInfo;
    },
});

const populationList = selectorFamily<PopulationInfo[], SelectedsInfo>({
  key: 'data-flow/population-list',
  get:
    ({ selectedPrefs, selectedCategory }) =>
    ({ get }) => {
      return get(formattedPopulations({ selectedPrefs, selectedCategory }));
    },
});

export const usePopulation = (selected: Prefectures[], category: string) => {
  return useRecoilValue(
    populationList({ selectedPrefs: selected, selectedCategory: category })
  );
};

export const usePopulationCategories = () => {
  const selectedCategory = useRecoilValue(selectedCategoryState);

  const changeCategory = useRecoilCallback(({ set }) => (target: string) => {
    set(selectedCategoryState, () => target);
  });

  return [populationCategories, selectedCategory, changeCategory] as const;
};
