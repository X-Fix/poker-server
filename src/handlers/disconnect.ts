import { Namespace, Socket } from 'socket.io';
import { DisconnectPayload } from '../definitions';
import { getSessionBySocketId } from '../stores/sessionStore';
import { parseSafeParticipantResponse } from '../utils';

const TEN_MINUTES: number = 10 * 60 * 1000;

function disconnect(
  reason: DisconnectPayload,
  socket: Socket,
  namespace: Namespace
): void {
  console.log('disconnect', reason);
  const session = getSessionBySocketId(socket.id);

  // If no session found, assume this sessionId is actually the socketId, ignore and move on
  if (!session) return;

  const { participants } = session;
  const disconnectedParticipant = participants.find(
    ({ socketId }) => socketId === socket.id
  );

  if (!disconnectedParticipant) return;

  // Unsubscribe socket from updates related to this session
  const disconnectedSocket = namespace.sockets.get(
    disconnectedParticipant.socketId as string
  );
  disconnectedSocket?.leave(session.id);

  // Update isConnected status and remove socketId
  disconnectedParticipant.isConnected = false;
  delete disconnectedParticipant.socketId;

  const connectedParticipants = participants.filter(({ socketId }) =>
    Boolean(socketId)
  );

  if (!connectedParticipants.length) {
    session.cleanUp = new Date(Date.now() + TEN_MINUTES);
  } else {
    // Broadcast update to all subscribers of the socket group (room)
    namespace
      .to(session.id)
      .emit('syncParticipants', parseSafeParticipantResponse(participants));
  }
}

export default disconnect;
