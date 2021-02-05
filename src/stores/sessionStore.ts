import { Session } from '../definitions';

type SessionStore = {
  [sessionId: string]: Session;
};

let sessionStore: SessionStore = {};

export function getSessionById(sessionId: string): Session {
  return sessionStore[sessionId];
}

export function saveSession(session: Session): void {
  sessionStore[session.id] = session;
}

export function deleteSession(sessionId: string): void {
  delete sessionStore[sessionId];
}

export function resetSessions(): void {
  sessionStore = {};
}
