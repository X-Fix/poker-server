import {
  leaveSession,
  newTopic,
  removeParticipant,
  setParticipantIsActive,
  setVote,
  subscribe,
} from './messages';
import {
  home,
  ping,
  createSessionRoute as createSession,
  joinSessionRoute as joinSession,
  resetRoute,
  dummySessionRoute,
} from './routes';

export const get = [home, ping, dummySessionRoute];
export const post = [createSession, joinSession, resetRoute];
export const messages = [
  leaveSession,
  newTopic,
  removeParticipant,
  setParticipantIsActive,
  setVote,
  subscribe,
];
