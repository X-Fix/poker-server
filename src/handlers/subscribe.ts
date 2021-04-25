import { Namespace, Socket } from 'socket.io';

import { SubscribePayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import { parseSafeSessionResponse } from '../utils';

function subscribe(
  { participantId, sessionId }: SubscribePayload,
  socket: Socket,
  namespace: Namespace
): void {
  const session = getSessionById(sessionId);

  /**
   * Can happen if the server restarts while client sessions still exist. Signal error to client so
   * user can start a new session
   */
  if (!session) {
    socket.emit('sessionError');
    socket.disconnect(true);
    return;
  }

  const { participants } = session;
  const participant = participants.find(({ id }) => id === participantId);

  if (!participant) {
    /**
     * Assume this participant was kicked while temporarily disconnected. Notify them of their
     * removal and abort subscribe attempt
     */
    socket.emit('removed');
    socket.disconnect(true);
    return;
  }

  // Attach socketId to participant
  participant.socketId = socket.id;
  // Set connection status
  participant.isConnected = true;

  const safeSession = parseSafeSessionResponse(session);

  // Send session object back to new subscriber
  socket.emit('syncSession', safeSession);
  // Broadcast update to other subscribers of the socket group (room)
  namespace.to(sessionId).emit('syncParticipants', safeSession.participants);
  // Subscribe participant's socket to socket group for future updates
  socket.join(sessionId);
}

export default subscribe;
