import { Request, Response } from 'express';

import { Route } from '../definitions';
import { createSession, joinSession } from '../handlers';
import { resetSessions } from '../stores/sessionStore';

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
