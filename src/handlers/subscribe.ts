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

  // TODO: handle this better
  // Can happen if server restarts while client sessions still exist. Need to signal to client that
  // a new session needs to be created. Maybe throw a connection error?
  if (!session) return;

  const { participants } = session;

  const participant = participants.find(
    (currentParticipant) => currentParticipant.id === participantId
  );

  if (!participant) return;

  // Attach socketId to participant
  participant.socketId = socket.id;
  // Set connection status
  participant.isConnected = true;

  // TODO: unsubscribe any already existing socket connections

  const safeSession = parseSafeSessionResponse(session);

  // Send session object back to new subscriber
  socket.emit('syncSession', safeSession);
  // Broadcast update to other subscribers of the socket group (room)
  namespace.to(sessionId).emit('syncParticipants', safeSession.participants);
  // Subscribe participant's socket to socket group for future updates
  socket.join(sessionId);
}

export default subscribe;
