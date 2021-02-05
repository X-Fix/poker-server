import { Request, Response } from 'express';

import { Participant, Session } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import { HTTP_STATUS } from '../utils';

function joinSession({ body }: Request, response: Response): void {
  const { participantName, sessionId } = body;

  const session: Session = getSessionById(sessionId);

  if (!session) {
    response.sendStatus(HTTP_STATUS.NOT_FOUND);
    return;
  }

  const participant: Participant = new Participant(participantName);
  session.participants.push(participant);

  response.json({
    participant,
    session,
  });
}

export default joinSession;
