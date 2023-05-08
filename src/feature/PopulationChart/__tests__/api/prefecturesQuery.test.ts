import { describe, test, expect } from 'vitest';
import { waitFor } from '@testing-library/react';

import { setupMockServer } from '@/src/mock/setup';
import { prefecturesHandler } from '@/src/feature/PopulationChart/mock/predectures';

import { prefecturesQuery } from '@/src/feature/PopulationChart/api/prefecturesQuery';

describe('PrefecturesQuery TEST', () => {
  const server = setupMockServer([prefecturesHandler()]);
  test('通信成功時は、値が配列の要素数47個の状態である', async () => {
    const res = prefecturesQuery();

    const data = await res;

    await waitFor(() => {
      expect(data.result.length).toEqual(47);
    });
  });
  test('通信失敗:400', async () => {
    server.use(prefecturesHandler(400));

    expect(prefecturesQuery).rejects.toThrowError('400');
  });

  test('通信失敗:500', async () => {
    server.use(prefecturesHandler(500));

    expect(prefecturesQuery).rejects.toThrowError('500');
  });
});
