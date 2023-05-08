import { rest } from 'msw';
import { ResasResponse, Prefectures } from '@/src/types/resas';

const path = () => 'https://opendata.resas-portal.go.jp/api/v1/prefectures';

export const generatePrefectures = (): Prefectures[] => {
  const array = Array.from({ length: 47 }, (_, index) =>
    PrefectureFactory(index)
  );
  return array;
};

const PrefectureFactory = (id: number): Prefectures => {
  return {
    prefCode: id,
    prefName: `都道府県${id}`,
  };
};

export const prefecturesHandler = (
  status: 200 | 400 | 403 | 404 | 500 = 200
) => {
  return rest.get<Prefectures, { id: string }, ResasResponse<Prefectures[]>>(
    path(),
    async (_, res, ctx) => {
      if (status === 400) {
        return res.once(ctx.status(200), ctx.json(400));
      }

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
          result: generatePrefectures(),
        })
      );
    }
  );
};
