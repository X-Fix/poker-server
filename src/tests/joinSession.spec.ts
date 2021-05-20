import supertest from 'supertest';
import app from '../server';

const server = app.listen(3002);
const request = supertest(server);

describe('/api/join-session', () => {
  const defaultRequest = {
    participantName: 'Cameron',
    sessionId: '',
  };

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    const setupRequest = {
      participantName: 'Owner',
      sessionName: 'ReadyPlayerOne',
    };
    const {
      body: { sessionId },
    } = await request.post('/api/create-session').send(setupRequest);
    defaultRequest.sessionId = sessionId;
  });

  afterEach(async () => {
    await request.post('/debug/resetSessions');
  });

  it('should return the expected objects', async () => {
    const { body, status } = await request
      .post('/api/join-session')
      .send(defaultRequest);

    const { participantId, sessionId } = body;

    expect(status).toBe(200);
    expect(participantId).toBeDefined();
    expect(sessionId).toBeDefined();
  });

  it('should return an error if the session is not found', async () => {
    const { status } = await request
      .post('/api/join-session')
      .send({ ...defaultRequest, sessionId: 'NeverGonnaFindThis' });

    expect(status).toBe(404);
  });
});
