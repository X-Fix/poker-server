import { Namespace, Socket } from 'socket.io';

import { Session, SubscribePayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import { parseSafeParticipantResponse } from '../utils';

function subscribe(
  { participantId, sessionId }: SubscribePayload,
  socket: Socket,
  namespace: Namespace,
  callback: (session: Session) => void
): void {
  const session = getSessionById(sessionId);

  // TODO: handle this better
  // Can happen if server restarts while client sessions still exist. Need to signal to client that
  // a new session needs to be created
  if (!session) return;

  const { participants } = session;

  const participant = participants.find(
    (currentParticipant) => currentParticipant.id === participantId
  );

  if (!participant) return;

  // Attach socketId to participant
  participant.socketId = socket.id;
  participant.isConnected = true;

  // TODO: unsubscribe any already existing socket connections

  const safeParticipants = parseSafeParticipantResponse(participants);
  if (typeof callback === 'function') {
    // Broadcast update to already existing subscribers of the socket group (room)
    namespace.to(sessionId).emit('syncParticipants', safeParticipants);

    // Subscribe participant's socket to socket group (room)
    // Do this after emit cos we're gonna respond with the session object next
    socket.join(sessionId);

    // Send session object back to subscriber
    callback(session);
  } else {
    // Subscribe participant's socket to socket group (room)
    socket.join(sessionId);

    // Broadcast update to ALL subscribers of the socket group (room)
    namespace.to(sessionId).emit('syncParticipants', safeParticipants);
  }
}

export default subscribe;
