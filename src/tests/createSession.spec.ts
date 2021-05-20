import supertest from 'supertest';
import app from '../server';

const server = app.listen(3003);
const request = supertest(server);

describe('/api/create-session', () => {
  const defaultRequest = {
    participantName: 'Cameron',
    sessionName: 'ReadyPlayerOne',
  };

  afterAll(() => {
    server.close();
  });

  afterEach(async () => {
    await request.post('/debug/resetSessions');
  });

  it('should return a new session object', async () => {
    const { body, status } = await request
      .post('/api/create-session')
      .send(defaultRequest);

    const { participantId, sessionId } = body;

    expect(status).toBe(200);
    expect(participantId).toBeDefined();
    expect(sessionId).toBeDefined();
  });
});
