import { rest } from 'msw';
import {
  ResasResponse,
  Populations,
  Population,
  Category,
} from '@/src/types/resas';
import {
  populationCategories,
  Categoryies,
} from '@/src/feature/PopulationChart/hook/usePopulation';

const path = () =>
  'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear';

export const generatePopulations = (code: number): Populations => {
  const array = populationCategories.map((category) => {
    return categoryFactory(category, code);
  });
  return {
    boundaryYear: 9999,
    data: array,
  };
};

const categoryFactory = (category: Categoryies, code: number): Category => {
  return {
    label: category,
    data: populationFactory(category, code),
  };
};

const populationFactory = (
  category: Categoryies,
  code: number
): Population[] => {
  const startYear = 1960;
  const elapsedYear = 5;
  const populations = Array.from({ length: 18 }, (_, index) => {
    const year = startYear + elapsedYear * index;
    switch (category) {
      case '総人口':
        return {
          year: year,
          value: (startYear + code) * index,
        };
      case '年少人口':
        return {
          year: year,
          value: ((startYear + code) * index) / 2,
          rate: 20.5,
        };
      case '生産年齢人口':
        return {
          year: year,
          value: (startYear + code) * index * 1.5,
          rate: 20.5,
        };
      case '老年人口':
        return {
          year: year,
          value: (startYear + code) * index * 2,
          rate: 20.5,
        };
    }
  });
  return populations;
};

export const populationsHandler = (
  status: 200 | 400 | 403 | 404 | 500 = 200
) => {
  return rest.get<Populations, { id: string }, ResasResponse<Populations>>(
    path(),
    async (req, res, ctx) => {
      const queryPrefCode = req.url.searchParams.get('prefCode');
      if (queryPrefCode === null || status === 400) {
        return res.once(ctx.status(200), ctx.json(400));
      }

      const prefCode = parseInt(queryPrefCode);

      if (status === 500) {
        return res.once(
          ctx.status(500),
          ctx.json({
            statusCode: 500,
            message: 'Bad Request',
            description: '',
          })
        );
      }

      return res(
        ctx.status(200),
        ctx.json({
          message: null,
          result: generatePopulations(prefCode),
        })
      );
    }
  );
};
