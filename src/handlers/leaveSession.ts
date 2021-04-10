import { Namespace, Socket } from 'socket.io';
import { LeaveSessionPayload } from '../definitions';
import { deleteSession, getSessionById } from '../stores/sessionStore';

function leaveSession(
  { sessionId }: LeaveSessionPayload,
  socket: Socket,
  namespace: Namespace
): void {
  const session = getSessionById(sessionId);
  const { ownerId, participants } = session;

  // Find the acting participant by looking for a participant with matching socketId
  // Prefer this over self-identifying methods like "I am the owner" (easier to fake)
  const actingParticipant = participants.find(
    ({ socketId }) => socketId === socket.id
  );

  // Ignore if acting participant can't be found
  if (!actingParticipant) return;

  const { id: participantId, socketId } = actingParticipant;

  // Filter out the acting participant
  session.participants = participants.filter(({ id }) => id !== participantId);

  // If no participants left, delete the session
  if (session.participants.length === 0) {
    deleteSession(sessionId);
  } else {
    // If the leaving participant is the session owner, assign a new session owner
    if (ownerId === participantId) {
      session.ownerId = participants[0].id;
    }

    // Broadcast update to all subscribers of the socket group (room)
    namespace.to(sessionId).emit('syncParticipants', participants);
  }

  if (!socketId) return;

  const removedSocket = namespace.sockets.get(socketId);

  if (!removedSocket) return;

  // Unsubscribe the removed participant from the socket group (room)
  removedSocket.leave(sessionId);

  // Notify the socket client they have been removed and close connection
  removedSocket.emit('removed');
  removedSocket.disconnect(true);
}

export default leaveSession;
