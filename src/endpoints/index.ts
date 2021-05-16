import {
  pong,
  disconnect,
  newTopic,
  removeParticipant,
  setParticipantIsActive,
  setVote,
} from './messages';
import {
  ping,
  createSessionRoute as createSession,
  joinSessionRoute as joinSession,
  resetRoute,
  dummySessionRoute,
} from './routes';

export const get = [ping, dummySessionRoute];
export const post = [createSession, joinSession, resetRoute];
export const messages = [
  pong,
  disconnect,
  newTopic,
  removeParticipant,
  setParticipantIsActive,
  setVote,
];
