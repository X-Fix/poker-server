import {
  home,
  ping,
  createSessionRoute as createSession,
  joinSessionRoute as joinSession,
  resetRoute,
} from './routes';

export const get = [home, ping];
export const post = [createSession, joinSession, resetRoute];
