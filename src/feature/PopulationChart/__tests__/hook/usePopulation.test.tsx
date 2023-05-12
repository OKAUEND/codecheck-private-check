import { describe, test, expect } from 'vitest';
import { RecoilRoot } from 'recoil';
import { act, renderHook, waitFor } from '@testing-library/react';

import { setupMockServer } from '@/src/mock/setup';
import {
  populationsHandler,
  generatePopulations,
} from '@/src/feature/PopulationChart/mock/population';

import {
  usePopulation,
  usePopulationCategories,
  populationCategories,
  Categories,
} from '@/src/feature/PopulationChart/hook/usePopulation';
import { PopulationInfo, Prefectures } from '@/src/types/resas';

interface Props {
  selectedPrefectures: Prefectures[];
}

type ReturnType = PopulationInfo[];

describe('usePopulation Hook TEST', () => {
  setupMockServer([populationsHandler()]);

  const generatePrefecture = (id: number, name: string) => {
    return { prefCode: id, prefName: name };
  };

  const generatePrefectureV2 = (id: number, name: string): SelectedCheckbox => {
    return { checked: true, value: id, name: name };
  };

  test('都道府県が選択されていない時は、件数が0件である', async () => {
    const { result } = renderHook(() => usePopulation(), {
      wrapper: RecoilRoot,
    });

    await waitFor(() => {
      expect(result.current.length).toEqual(0);
    });
  });
  test('チェックされた都道府県がある時、APIからデータを取得しているか', async () => {
    const { result, rerender } = renderHook(
      () => {
        const population = usePopulation();
        const [, selectedPref] = useSelectedPrefectures();

        return { population, selectedPref };
      },
      {
        wrapper: RecoilRoot,
      }
    );

    await waitFor(() => {
      expect(result.current.population.length).toEqual(0);
    });

    // const newProps: Props = {
    //   selectedPrefectures: [generatePrefecture(1, 'Mock')],
    // };

    const testPrefData = generatePrefectureV2(1, 'Mock');

    // rerender(newProps);

    const testDate = generatePopulations(1);

    await act(async () => {
      result.current.selectedPref(testPrefData);
    });

    await waitFor(() => {
      expect(result.current.population.length).toEqual(18);
      const totalPOP = testDate.data[0].data;

      result.current.population.forEach((value, index) => {
        const nowPoP = totalPOP[index];
        const target = value[1];
        expect(target).toEqual(nowPoP.value);
      });
    });
  });
  test('人口カテゴリーが変更された場合、値も変わっているか', async () => {
    const { result } = renderHook(
      () => {
        const population = usePopulation();
        const [, , setCategory] = usePopulationCategories();

        return { population, setCategory };
      },

      {
        wrapper: RecoilRoot,
      }
    );

    await waitFor(() => {
      expect(result.current.population.length).toEqual(18);
    });

    //現状あまりいいやり方ではないため
    //The current testing environment is not configured to support act(...)が発生するため
    //解決するのだったら、Recoil内でループをやめて、サードライブラリでデータ取得をしたほうがよい
    await act(async () => {
      await waitFor(() => {
        result.current.setCategory('生産年齢人口');
      });
    });

    const testDate = generatePopulations(1);
    const workerPOP = testDate.data.filter(
      (data) => data.label === '生産年齢人口'
    )[0];
    await waitFor(() => {
      result.current.population.forEach((value, index) => {
        const POP = workerPOP.data[index];
        const target = value[1];

        expect(target).toEqual(POP.value);
      });
    });

    await act(async () => {
      await waitFor(() => {
        result.current.setCategory('年少人口');
      });
    });

    const childPOP = testDate.data.filter(
      (data) => data.label === '年少人口'
    )[0];

    await waitFor(() => {
      result.current.population.forEach((value, index) => {
        const POP = childPOP.data[index];
        const target = value[1];

        expect(target).toEqual(POP.value);
      });
    });

    await act(async () => {
      await waitFor(() => {
        result.current.setCategory('老年人口');
      });
    });

    const seniorPOP = testDate.data.filter(
      (data) => data.label === '老年人口'
    )[0];

    await waitFor(() => {
      result.current.population.forEach((value, index) => {
        const POP = seniorPOP.data[index];
        const target = value[1];

        expect(target).toEqual(POP.value);
      });
    });
  });
});

describe('usePopulationCategories Hook TEST', () => {
  test('人口のカテゴリーを文字列の配列で戻り値に含まれているか', async () => {
    const { result } = renderHook(() => usePopulationCategories(), {
      wrapper: RecoilRoot,
    });

    expect(result.current[0]).toEqual(populationCategories);
  });
  test('選択状態の初期値は総人口となっているか', async () => {
    const { result } = renderHook(() => usePopulationCategories(), {
      wrapper: RecoilRoot,
    });

    expect(result.current[1]).toEqual(populationCategories[0]);
  });
  test('状態を更新したら、選択の状態も変更されるか', async () => {
    const { result } = renderHook(() => usePopulationCategories(), {
      wrapper: RecoilRoot,
    });

    const testDate: Categories = populationCategories[2];

    expect(result.current[1]).toEqual(populationCategories[0]);

    act(() => {
      result.current[2](testDate);
    });

    expect(result.current[1]).toEqual(testDate);
  });
});
