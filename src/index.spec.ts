import supertest from 'supertest';

import app from './index';

const request = supertest(app);

afterAll(() => {
  app.close();
});

describe('/', () => {
  it('should respond with JSON', async () => {
    const { body, headers, status } = await request.get('/');

    expect(status).toBe(200);
    expect(headers['content-type']).toMatch(/json/);
    expect(body.status).toEqual('ok');
  });
});

describe('/ping', () => {
  it('should respond to a ping', async () => {
    const { status, text } = await request.get('/ping');

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

describe('/createSession', () => {
  const defaultRequest = {
    participantName: 'Cameron',
    sessionName: 'ReadyPlayerOne',
  };

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
