import { Session } from '../definitions';

type SessionStore = {
  [sessionId: string]: Session;
};

const sessionStore: SessionStore = {};

export function getSessionById(sessionId: string): Session | undefined {
  return sessionStore[sessionId];
}

export function saveSession(session: Session): void {
  sessionStore[session.id] = session;
}

export function deleteSession(sessionId: string): void {
  delete sessionStore[sessionId];
}
