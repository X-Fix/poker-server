import { Namespace, Socket } from 'socket.io';
import { DisconnectPayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import { DISCONNECT_REASON } from '../utils';

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
  console.log({ reason });
  // If this disconnect was intentionally caused by the server or client, ignore it
  if (isIntentionalDisconnect(reason)) return;

  socket.rooms.forEach((sessionId) => {
    const session = getSessionById(sessionId);

    // If no session found, assume this sessionId is actually the socketId, ignore and move on
    if (!session) return;

    const { participants } = session;
    const disconnectedParticipant = participants.find(
      ({ socketId }) => socketId === socket.id
    );

    if (!disconnectedParticipant) return;

    // Remove the participant's socketId. This should signal to the rest that they are disconnected
    delete disconnectedParticipant.socketId;

    const connectedParticipants = participants.filter(({ socketId }) =>
      Boolean(socketId)
    );
    if (!connectedParticipants.length) {
      session.cleanUp = new Date(Date.now() + TEN_MINUTES);
    }

    // Broadcast update to all subscribers of the socket group (room)
    namespace.to(sessionId).emit('syncParticipants', participants);
  });
}

export default disconnect;
