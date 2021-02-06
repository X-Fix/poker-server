import { Namespace, Socket } from 'socket.io';

import { SubscribePayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';

function subscribe(
  { participantId, sessionId }: SubscribePayload,
  socket: Socket,
  namespace: Namespace
): void {
  const session = getSessionById(sessionId);
  const participant = session.participants.find(
    (currentParticipant) => currentParticipant.id === participantId
  );

  if (!participant) return;

  // Attach socketId to participant
  participant.socketId = socket.conn.id;

  // Subscribe participant's socket to socket group (room)
  socket.join(sessionId);

  // Broadcast update to all subscribers of the socket group (room)
  namespace.to(sessionId).emit('Sync', session);
}

export default subscribe;
