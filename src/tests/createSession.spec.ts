import supertest from 'supertest';
import app from '../server';

const server = app.listen(3003);
const request = supertest(server);

describe('/createSession', () => {
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
      .post('/createSession')
      .send(defaultRequest);

    const { session } = body;

    expect(status).toBe(200);
    expect(session.name).toEqual(defaultRequest.sessionName);
    expect(session.id).toBeDefined();
  });

  it('should return a new participant object', async () => {
    const { body, status } = await request
      .post('/createSession')
      .send(defaultRequest);

    const { participant } = body;

    expect(status).toBe(200);
    expect(participant.name).toEqual(defaultRequest.participantName);
    expect(participant.id).toBeDefined();
  });

  it('should have a participantId that matches the session ownerId', async () => {
    const { body } = await request.post('/createSession').send(defaultRequest);

    const { participant, session } = body;

    expect(participant.id).toEqual(session.ownerId);
  });

  it('the participant should be in the session participant list', async () => {
    const { body } = await request.post('/createSession').send(defaultRequest);

    const { participant, session } = body;

    expect(session.participants[0]).toEqual(participant);
  });
});
