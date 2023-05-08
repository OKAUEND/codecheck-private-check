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
  Categoryies,
} from '@/src/feature/PopulationChart/hook/usePopulation';
import {
  selectedPrefectures,
  useSelectedPrefectures,
} from '@/src/feature/PopulationChart/hook/useSelectedPrefectures';

describe('usePopulation Hook TEST', () => {
  setupMockServer([populationsHandler()]);

  test('都道府県が選択されていない時は、件数が0件である', async () => {
    const { result } = renderHook(() => usePopulation(), {
      wrapper: RecoilRoot,
    });

    await waitFor(() => {
      expect(result.current.length).toEqual(0);
    });
  });
  test('チェックされた都道府県がある時、APIからデータを取得しているか', async () => {
    const { result } = renderHook(
      () => {
        const population = usePopulation();
        const [, setPref] = useSelectedPrefectures();

        return { population, setPref };
      },
      {
        wrapper: RecoilRoot,
      }
    );

    await waitFor(() => {
      expect(result.current.population.length).toEqual(0);
    });

    //現状あまりいいやり方ではないため
    //The current testing environment is not configured to support act(...)が発生するため
    //解決するのだったら、Recoil内でループをやめて、サードライブラリでデータ取得をしたほうがよい
    await act(async () => {
      await waitFor(() => {
        result.current.setPref({ checked: true, value: 1, name: 'Mock' });
        result.current.setPref({ checked: true, value: 2, name: 'Mock2' });
      });
    });

    const testDate = generatePopulations(1);

    await waitFor(() => {
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
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={(snap) => {
              snap.set(
                selectedPrefectures,
                new Map([[1, { prefCode: 1, prefName: '仮都道府県' }]])
              );
            }}
          >
            {children}
          </RecoilRoot>
        ),
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

    const testDate: Categoryies = populationCategories[2];

    expect(result.current[1]).toEqual(populationCategories[0]);

    act(() => {
      result.current[2](testDate);
    });

    expect(result.current[1]).toEqual(testDate);
  });
});
