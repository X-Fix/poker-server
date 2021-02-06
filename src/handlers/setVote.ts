import { Namespace, Socket } from 'socket.io';
import { SetVotePayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';

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
    ({ socketId }) => socketId === socket.conn.id
  );

  // Ignore if acting participant can't be found
  if (!actingParticipant) return;

  actingParticipant.vote = vote;

  // Broadcast update to all subscribers of the socket group (room)
  namespace.to(sessionId).emit('sync', session);
}

export default setVote;
