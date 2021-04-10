import { Request, Response } from 'express';

import { Participant, Session } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import {
  generateParticipantName,
  HTTP_STATUS,
  parseSafeSessionResponse,
} from '../utils';

interface JoinSessionRequest extends Request {
  body: {
    participantName?: string;
    sessionId: string;
  };
}

function joinSession({ body }: JoinSessionRequest, response: Response): void {
  const { participantName, sessionId } = body;

  const session: Session = getSessionById(sessionId);

  if (!session) {
    response.sendStatus(HTTP_STATUS.NOT_FOUND);
    return;
  }

  // If participant didn't provide their name, kindly provide one for them 😏
  const safeParticipantName = participantName || generateParticipantName();

  // If duplicate names occur, append a counter to the end of the duplicates
  // (Similar to duplicate files in your folder system)
  let appendedParticipantName = safeParticipantName;
  let index = 0;

  // Declare match function outside of while loop cos https://eslint.org/docs/rules/no-loop-func
  function matchingName({ name }: Participant): boolean {
    return name === appendedParticipantName;
  }

  while (session.participants.find(matchingName)) {
    index += 1;
    appendedParticipantName = `${safeParticipantName} (${index})`;
  }

  const participant: Participant = new Participant(appendedParticipantName);
  session.participants.push(participant);

  response.json({
    participantId: participant.id,
    session: parseSafeSessionResponse(session),
  });
}

export default joinSession;
