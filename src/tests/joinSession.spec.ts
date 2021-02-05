import supertest from 'supertest';
import app from '../server';

const server = app.listen(3002);
const request = supertest(server);

describe('/joinSession', () => {
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
      body: {
        session: { id },
      },
    } = await request.post('/createSession').send(setupRequest);
    defaultRequest.sessionId = id;
  });

  afterEach(async () => {
    await request.post('/debug/resetSessions');
  });

  it('should return the expected objects', async () => {
    const { body, status } = await request
      .post('/joinSession')
      .send(defaultRequest);

    const { participant, session } = body;

    expect(status).toBe(200);
    expect(participant.name).toEqual(defaultRequest.participantName);
    expect(session.id).toEqual(defaultRequest.sessionId);
  });

  it("the participant should be in the session's participants list", async () => {
    const { body } = await request.post('/joinSession').send(defaultRequest);

    const { participant, session } = body;

    expect(session.participants).toContainEqual(participant);
  });

  it('should return an error if the session is not found', async () => {
    const { status } = await request
      .post('/joinSession')
      .send({ ...defaultRequest, sessionId: 'NeverGonnaFindThis' });

    expect(status).toBe(404);
  });
});
