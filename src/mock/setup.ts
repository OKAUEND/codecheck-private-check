import { afterAll, afterEach, beforeAll } from 'vitest';
import { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';
import 'whatwg-fetch';

export const setupMockServer = (handler: RequestHandler[]) => {
  const server = setupServer(...handler);
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  return server;
};
