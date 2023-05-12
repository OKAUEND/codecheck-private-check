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

export type Categories = '総人口' | '年少人口' | '生産年齢人口' | '老年人口';

type PopulationList = {
  selectedPrefs: Prefectures[];
  selectedCategory: string;
};

type PopulationSelected = {
  selectedPref: Prefectures;
  selectedCategory: string;
};

export const populationCategories: Categories[] = [
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

const filteredPopulation = selectorFamily<PopulationInfo[], PopulationSelected>(
  {
    key: 'data-flow/filtered-population',
    get:
      (prefecture) =>
      async ({ get }): Promise<PopulationInfo[]> => {
        const selectedCategory = get(selectedCategoryState);
        const populations = get(populationsQuery(prefecture.selectedPref));

        const filtered = populations.data.filter((population) => {
          return population.label === selectedCategory;
        })[0];

        const formmted = filtered.data.map((year) => {
          return {
            year: year.year,
            [prefecture.selectedPref.prefCode]: year.value,
          };
        });

        return formmted;
      },
  }
);

const formattedPopulations = selectorFamily<PopulationInfo[], PopulationList>({
  key: 'data-flow/formatted-populations',
  get:
    ({ selectedPrefs, selectedCategory }) =>
    ({ get }) => {
      // const selectedPrefectures = get(prefecturesMapToArray);

      const populations = get(
        waitForAll(
          selectedPrefs.map((prefecture) => {
            return filteredPopulation({
              selectedPref: prefecture,
              selectedCategory: selectedCategory,
            });
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

const populationList = selectorFamily({
  key: 'data-flow/population-list',
  get:
    () =>
    ({ get }) => {
      const selectedPrefectures = get(prefecturesMapToArray);
      const selectedCategory = get(selectedCategoryState);

      const result = get(
        formattedPopulations({
          selectedPrefs: selectedPrefectures,
          selectedCategory: selectedCategory,
        })
      );
    },
});

const populationListV2 = selector({
  key: 'data-flow/population-list',
  get: ({ get }) => {
    const selectedPrefectures = get(prefecturesMapToArray);
    const selectedCategory = get(selectedCategoryState);

    return get(
      formattedPopulations({
        selectedPrefs: selectedPrefectures,
        selectedCategory: selectedCategory,
      })
    );
  },
});

export const usePopulation = () => {
  return useRecoilValue(populationListV2);
};

export const usePopulationCategories = () => {
  const selectedCategory = useRecoilValue(selectedCategoryState);

  const changeCategory = useRecoilCallback(({ set }) => (target: string) => {
    set(selectedCategoryState, () => target);
  });

  return [populationCategories, selectedCategory, changeCategory] as const;
};
