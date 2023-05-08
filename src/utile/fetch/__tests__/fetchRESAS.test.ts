import { describe, test, expect } from 'vitest';

import { setupMockServer } from '@/src/mock/setup';
import { fetchRESASHandler, resasMockPath } from '@/src/utile/fetch/mock';

import { fetchRESAS } from '@/src/utile/fetch';
const server = setupMockServer([fetchRESASHandler()]);
describe('fetchRESAS TEST', () => {
  test('通信成功時は、Resultがあり値が存在している', async () => {
    const result = fetchRESAS(resasMockPath);

    const data = await result;

    expect(data.result).toEqual('RESAS');
  });
  test('通信失敗:400', async () => {
    server.use(fetchRESASHandler(400));
    expect(fetchRESAS(resasMockPath)).rejects.toThrowError(`400`);
  });

  test('通信失敗:403', async () => {
    server.use(fetchRESASHandler(403));

    expect(fetchRESAS(resasMockPath)).rejects.toThrowError(
      new Error(`${403} Forbidden`)
    );
  });

  test('通信失敗:404', async () => {
    server.use(fetchRESASHandler(404));

    expect(fetchRESAS(resasMockPath)).rejects.toThrowError(
      new Error(`${404} Not Found`)
    );
  });

  test('通信失敗:429', async () => {
    server.use(fetchRESASHandler(429));

    expect(fetchRESAS(resasMockPath)).rejects.toThrowError(
      new Error(`429 Many Request`)
    );
  });
});
