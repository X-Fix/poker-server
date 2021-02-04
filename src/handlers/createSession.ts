import { Request, Response } from 'express';

import { Participant, Session } from '../definitions';
import { getSessionById, saveSession } from '../stores/sessionStore';

function createSession({ body }: Request, response: Response): void {
  const { participantName, sessionName } = body;

  const participant: Participant = new Participant(participantName);
  let session: Session = new Session(participant, sessionName);

  // Regenerate session object if conflicting id's found
  while (getSessionById(session.id)) {
    session = new Session(participant, sessionName);
  }

  saveSession(session);

  response.json({
    participant,
    session,
  });
}

export default createSession;
