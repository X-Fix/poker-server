import { Request, Response } from 'express';

import { Participant, Route, Session } from '../definitions';
import { createSession, joinSession } from '../handlers';
import { resetSessions, saveSession } from '../stores/sessionStore';

export const home: Route = {
  handler: (req: Request, response: Response) => {
    response.send({ status: 'ok' });
  },
  url: '/',
};

export const ping: Route = {
  handler: (req: Request, response: Response) => {
    response.send('pong');
  },
  url: '/ping',
};

export const createSessionRoute: Route = {
  handler: createSession,
  url: '/createSession',
};

export const joinSessionRoute: Route = {
  handler: joinSession,
  url: '/joinSession',
};

export const resetRoute: Route = {
  handler: (req, res) => {
    resetSessions();
    res.end();
  },
  url: '/debug/resetSessions',
};

export const dummySessionRoute: Route = {
  handler: (req, res) => {
    const participant = new Participant('Cameron');
    participant.id = '1ze456';
    const session = new Session(participant, 'Dummy Room');
    session.id = 'QWERTY';

    saveSession(session);

    res.send(session);
  },
  url: '/debug/dummySession',
};
