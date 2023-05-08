import { rest } from 'msw';
import { ResasResponse, Prefectures } from '@/src/types/resas';

export const resasMockPath = 'https://opendata.resas-portal.go.jp/api/v1/Mock';

export const fetchRESASHandler = (
  status: 200 | 400 | 403 | 404 | 429 = 200
) => {
  return rest.get<Prefectures, { id: string }, ResasResponse<string>>(
    resasMockPath,
    async (_, res, ctx) => {
      if (status === 400) {
        return res.once(ctx.status(200), ctx.json(400));
      }

      if (status === 403) {
        return res.once(
          ctx.status(200),
          ctx.json({
            statusCode: 403,
            message: 'Forbidden',
            description: '',
          })
        );
      }

      if (status === 404) {
        return res.once(
          ctx.status(200),
          ctx.json({
            statusCode: 404,
            message: 'Not Found',
            description: '',
          })
        );
      }

      if (status === 429) {
        return res.once(
          ctx.status(200),
          ctx.json({
            message: null,
          })
        );
      }

      return res.once(
        ctx.status(200),
        ctx.json({
          message: null,
          result: 'RESAS',
        })
      );
    }
  );
};
