import { Namespace, Socket } from 'socket.io';
import { RemoveParticipantPayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';

function removeParticipant(
  { participantId, sessionId }: RemoveParticipantPayload,
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

  // Ignore if acting participant can't be found, or isn't the session owner
  if (!actingParticipant || actingParticipant.id !== ownerId) return;

  const removedParticipant = participants.find(
    ({ id }) => id === participantId
  );

  if (!removedParticipant) return;

  // Filter out the removed participant
  session.participants = participants.filter(({ id }) => id !== participantId);

  // Broadcast update to all subscribers of the socket group (room)
  namespace.to(sessionId).emit('sync', session);

  const { socketId: removedSocketId } = removedParticipant;

  if (!removedSocketId) return;

  const removedSocket = namespace.sockets.get(removedSocketId);

  if (!removedSocket) return;

  // Unsubscribe the removed participant from the socket group (room)
  removedSocket.leave(sessionId);

  // Notify the socket client they have been removed and close connection
  removedSocket.emit('removed');
  removedSocket.disconnect(true);
}

export default removeParticipant;
