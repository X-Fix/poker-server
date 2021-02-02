import supertest from 'supertest';

import app from './index';

const request = supertest(app);

describe('index', () => {
  afterAll(() => {
    app.close();
  });

  it('should respond with JSON', async () => {
    const { body, headers, status } = await request.get('/');

    expect(status).toBe(200);
    expect(headers['content-type']).toMatch(/json/);
    expect(body.status).toEqual('ok');
  });
});
