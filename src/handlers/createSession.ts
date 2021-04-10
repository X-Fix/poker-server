import { Request, Response } from 'express';

import { Participant, Session } from '../definitions';
import { getSessionById, saveSession } from '../stores/sessionStore';
import { generateParticipantName, generateSessionName } from '../utils';

interface CreateSessionRequest extends Request {
  body: {
    cardSequence: string[];
    participantName?: string;
    sessionName?: string;
  };
}

function createSession(
  { body }: CreateSessionRequest,
  response: Response
): void {
  const { cardSequence, participantName, sessionName } = body;

  const participant: Participant = new Participant(
    // If participant didn't provide their name, kindly provide one for them 😏
    participantName || generateParticipantName()
  );

  const safeSessionName = sessionName || generateSessionName();
  let session: Session = new Session(
    participant,
    cardSequence,
    safeSessionName
  );

  // Regenerate session object if conflicting id's found
  while (getSessionById(session.id)) {
    session = new Session(participant, cardSequence, safeSessionName);
  }

  saveSession(session);

  response.json({
    participantId: participant.id,
    session,
  });
}

export default createSession;
