import { Namespace, Socket } from 'socket.io';
import { DisconnectPayload } from '../definitions';
import { getSessionById, getSessionBySocketId } from '../stores/sessionStore';
import { DISCONNECT_REASON, parseSafeParticipantResponse } from '../utils';

const { IO_SERVER_DISCONNECT, IO_CLIENT_DISCONNECT } = DISCONNECT_REASON;

function isIntentionalDisconnect(reason: DisconnectPayload): boolean {
  return reason === IO_SERVER_DISCONNECT || reason === IO_CLIENT_DISCONNECT;
}

const TEN_MINUTES: number = 10 * 60 * 1000;

function disconnect(
  reason: DisconnectPayload,
  socket: Socket,
  namespace: Namespace
): void {
  console.log({ reason }, socket.id);
  const session = getSessionBySocketId(socket.id);

  console.log('session found', Boolean(session));
  // If no session found, assume this sessionId is actually the socketId, ignore and move on
  if (!session) return;

  const { participants } = session;
  const disconnectedParticipant = participants.find(
    ({ socketId }) => socketId === socket.id
  );

  console.log(
    'disconnected participant found',
    Boolean(disconnectedParticipant)
  );
  if (!disconnectedParticipant) return;

  // Remove the participant's socketId and updated isConnected property
  delete disconnectedParticipant.socketId;
  disconnectedParticipant.isConnected = false;

  const connectedParticipants = participants.filter(({ socketId }) =>
    Boolean(socketId)
  );
  if (!connectedParticipants.length) {
    session.cleanUp = new Date(Date.now() + TEN_MINUTES);
  }
  console.log('session scheduled for cleanup', session.cleanUp?.toTimeString());

  // Broadcast update to all subscribers of the socket group (room)
  namespace
    .to(session.id)
    .emit('syncParticipants', parseSafeParticipantResponse(participants));
  console.log('disconnect update broadcast');
}

export default disconnect;
