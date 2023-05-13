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
  selectedCategory: string;
}

type ReturnType = PopulationInfo[];

describe('usePopulation Hook TEST', () => {
  setupMockServer([populationsHandler()]);

  const generatePrefecture = (id: number, name: string) => {
    return { prefCode: id, prefName: name };
  };

  test('都道府県が選択されていない時は、件数が0件である', async () => {
    const { result } = renderHook(() => usePopulation([], '総人口'), {
      wrapper: RecoilRoot,
    });

    await waitFor(() => {
      expect(result.current.length).toEqual(0);
    });
  });
  test('チェックされた都道府県がある時、APIからデータを取得しているか', async () => {
    const { result, rerender } = renderHook<ReturnType, Props>(
      (props) =>
        usePopulation(props.selectedPrefectures, props.selectedCategory),
      {
        initialProps: {
          selectedPrefectures: [],
          selectedCategory: '総人口',
        },
        wrapper: RecoilRoot,
      }
    );

    await waitFor(() => {
      expect(result.current.length).toEqual(0);
    });

    const newProps: Props = {
      selectedPrefectures: [
        generatePrefecture(1, 'Mock'),
        generatePrefecture(2, 'Mock2'),
      ],
      selectedCategory: '総人口',
    };

    rerender(newProps);

    const testDate = generatePopulations(1);

    await waitFor(() => {
      expect(result.current.length).toEqual(18);
      const totalPOP = testDate.data[0].data;

      result.current.forEach((value, index) => {
        const nowPoP = totalPOP[index];
        const target = value[1];
        expect(target).toEqual(nowPoP.value);
      });
    });
  });
  test('人口カテゴリーが変更された場合、値も変わっているか', async () => {
    const { result, rerender } = renderHook<ReturnType, Props>(
      (props) =>
        usePopulation(props.selectedPrefectures, props.selectedCategory),
      {
        initialProps: {
          selectedPrefectures: [generatePrefecture(1, 'Mock')],
          selectedCategory: '総人口',
        },
        wrapper: RecoilRoot,
      }
    );

    await waitFor(() => {
      expect(result.current.length).toEqual(18);
    });

    const newWorkerProps: Props = {
      selectedPrefectures: [generatePrefecture(1, 'Mock')],
      selectedCategory: '生産年齢人口',
    };
    rerender(newWorkerProps);

    const testDate = generatePopulations(1);
    const workerPOP = testDate.data.filter(
      (data) => data.label === '生産年齢人口'
    )[0];
    await waitFor(() => {
      result.current.forEach((value, index) => {
        const POP = workerPOP.data[index];
        const target = value[1];

        expect(target).toEqual(POP.value);
      });
    });

    const newChildProps: Props = {
      selectedPrefectures: [generatePrefecture(1, 'Mock')],
      selectedCategory: '年少人口',
    };
    rerender(newChildProps);

    const childPOP = testDate.data.filter(
      (data) => data.label === '年少人口'
    )[0];

    await waitFor(() => {
      result.current.forEach((value, index) => {
        const POP = childPOP.data[index];
        const target = value[1];

        expect(target).toEqual(POP.value);
      });
    });

    const newSeniorProps: Props = {
      selectedPrefectures: [generatePrefecture(1, 'Mock')],
      selectedCategory: '老年人口',
    };
    rerender(newSeniorProps);

    const seniorPOP = testDate.data.filter(
      (data) => data.label === '老年人口'
    )[0];

    await waitFor(() => {
      result.current.forEach((value, index) => {
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
