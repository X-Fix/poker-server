import { Namespace, Socket } from 'socket.io';
import { SetVotePayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import {
  parseSafeParticipantResponse,
  parseSafeSessionResponse,
} from '../utils';

function setVote(
  { sessionId, vote }: SetVotePayload,
  socket: Socket,
  namespace: Namespace
): void {
  const session = getSessionById(sessionId);
  const { participants } = session;

  // Find the acting participant by looking for a participant with matching socketId
  // Prefer this over self-identifying methods like "I am the owner" (easier to fake)
  const actingParticipant = participants.find(
    ({ socketId }) => socketId === socket.id
  );

  // Ignore if acting participant can't be found
  if (!actingParticipant) return;

  actingParticipant.vote = vote;

  // If all active participants have voted, move to the 'result' phase
  if (
    participants.every(
      ({ isActive, vote: pVote }) => !isActive || Boolean(pVote)
    )
  ) {
    session.phase = 'result';

    // Broadcast session update to all subscribers of the socket group (room)
    namespace
      .to(sessionId)
      .emit('syncSession', parseSafeSessionResponse(session));
  } else {
    // Broadcast participants update to all subscribers of the socket group (room)
    namespace
      .to(sessionId)
      .emit('syncParticipants', parseSafeParticipantResponse(participants));
  }
}

export default setVote;
