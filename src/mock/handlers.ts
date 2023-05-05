import { rest } from 'msw';
export const handlers = [
  rest.get('/test', (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];
