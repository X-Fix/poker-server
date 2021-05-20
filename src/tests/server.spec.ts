import supertest from 'supertest';
import app from '../server';

const server = app.listen(3001);
const request = supertest(server);

afterAll(() => {
  app.close();
});

describe('/api/ping', () => {
  it('should respond to a ping', async () => {
    const { status, text } = await request.get('/api/ping');

    expect(status).toBe(200);
    expect(text).toEqual('pong');
  });
});

describe('unknown page', () => {
  it('should respond with a 404', async () => {
    const { status } = await request.get('/notFound');

    expect(status).toBe(404);
  });
});
