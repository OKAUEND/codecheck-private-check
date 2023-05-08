import { describe, test, expect } from 'vitest';
import { waitFor } from '@testing-library/react';

import { setupMockServer } from '@/src/mock/setup';
import { populationsHandler } from '@/src/feature/PopulationChart/mock/population';
import { populationQuery } from '@/src/feature/PopulationChart/api/populationQuery';
import { populationCategories } from '@/src/feature/PopulationChart/hook/usePopulation';

describe('PopulationQuery TEST', () => {
  const server = setupMockServer([populationsHandler()]);
  const query = 'prefCode=1';
  test('都道府県の人口値が取得される', async () => {
    const res = populationQuery(query);

    const data = await res;

    await waitFor(() => {
      expect(data.boundaryYear).toEqual(9999);
      expect(data.data.length).toEqual(4);
      data.data.forEach((category, index) => {
        const categoryIndex = populationCategories[index];
        expect(category.label).toEqual(categoryIndex);
      });
    });
  });
  test('通信失敗:400', async () => {
    server.use(populationsHandler(400));

    expect(populationQuery(query)).rejects.toThrowError(new Error(`400`));
  });

  test('通信失敗:500', async () => {
    server.use(populationsHandler(500));

    expect(populationQuery(query)).rejects.toThrowError(new Error(`500`));
  });
});
