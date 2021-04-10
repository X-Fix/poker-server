import { Session } from '../definitions';

type SessionStore = {
  [sessionId: string]: Session;
};

let sessionStore: SessionStore = {};

export function getSessionById(sessionId: string): Session {
  return sessionStore[sessionId];
}

export function getSessionBySocketId(socketId: string): Session | undefined {
  let session: Session | undefined;

  Object.keys(sessionStore).some((sessionId) => {
    const hasParticipant = sessionStore[sessionId].participants?.some(
      (participant) => socketId === participant.socketId
    );
    if (hasParticipant) {
      session = sessionStore[sessionId];
    }

    return Boolean(session);
  });

  return session;
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
