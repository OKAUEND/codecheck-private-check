import { describe, test, expect } from 'vitest';
import { RecoilRoot } from 'recoil';
import { renderHook, act } from '@testing-library/react';
import { useSelectedPrefectures } from '@/src/feature/PopulationChart/hook/useSelectedPrefectures';
import { SelectedCheckbox } from '@/src/types/Element';

describe('useSelectedPrefectures Hook TEST', () => {
  const testDateFactory = (checked: boolean, id: number): SelectedCheckbox => {
    return { checked: checked, value: id, name: 'Mock' };
  };
  test('React Eventが発生した時、新しく値を追加を出来るか', () => {
    const { result } = renderHook(() => useSelectedPrefectures(), {
      wrapper: RecoilRoot,
    });

    expect(result.current[0].length).toEqual(0);
    const testDate = testDateFactory(true, 1);
    act(() => {
      result.current[1](testDate);
    });

    expect(result.current[0].length).toEqual(1);

    const mapData = result.current[0][0];

    expect(mapData).not.toEqual(undefined);
    expect(mapData).not.toEqual({ PrefCode: 1, PrefName: 'Mock' });
  });
  test('checkedがFalseのとき、値が削除されるか', () => {
    const { result } = renderHook(() => useSelectedPrefectures(), {
      wrapper: RecoilRoot,
    });

    expect(result.current[0].length).toEqual(0);
    const testDate = testDateFactory(true, 1);
    act(() => {
      result.current[1](testDate);
    });

    expect(result.current[0].length).toEqual(1);

    const unCheckedData = testDateFactory(false, 1);

    act(() => {
      result.current[1](unCheckedData);
    });

    expect(result.current[0].length).toEqual(0);

    const mapData = result.current[0][0];

    expect(mapData).toEqual(undefined);
  });
});
