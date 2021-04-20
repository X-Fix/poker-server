import { Namespace, Socket } from 'socket.io';
import { DisconnectPayload } from '../definitions';
import { getSessionBySocketId } from '../stores/sessionStore';
import {
  parseSafeParticipantResponse,
  parseSafeSessionResponse,
} from '../utils';

const TEN_MINUTES: number = 10 * 60 * 1000;

function isIntentionalDisconnect(reason: string): boolean {
  return reason === 'client namespace disconnect';
}

function disconnect(
  reason: DisconnectPayload,
  socket: Socket,
  namespace: Namespace
): void {
  console.log('disconnect', reason);
  const session = getSessionBySocketId(socket.id);

  if (!session) return;

  const { participants, id: sessionId, ownerId } = session;
  const disconnectedParticipant = participants.find(
    ({ socketId }) => socketId === socket.id
  );

  if (!disconnectedParticipant) return;

  /**
   * Clean up all connections associated with this participant
   * - Unsubscribe the dead socket from session updates
   * - Update the participant's isConnected status
   * - Remove any reference to the dead socket's id
   */
  const disconnectedSocket = namespace.sockets.get(
    disconnectedParticipant.socketId as string
  );
  disconnectedSocket?.leave(sessionId);

  disconnectedParticipant.isConnected = false;
  delete disconnectedParticipant.socketId;

  // Check the status of the remaining participants
  const connectedParticipants = participants.filter(({ socketId }) =>
    Boolean(socketId)
  );

  if (!connectedParticipants.length) {
    /**
     * Schedule session for cleanup
     * We used to delete the session immediately if the disconnection was intentional, but if all
     * but one disconnects unintentionally (eg. signal loss) and the last participant leaves
     * intentionally, this will delete a session without giving the others a chance to reconnect
     */
    session.cleanUp = new Date(Date.now() + TEN_MINUTES);
  }

  /**
   * If the disconnect was intentional: update the session participants list, delegate new ownership
   * (if necessary), and broadcast the updates to the remaining participants
   */
  if (isIntentionalDisconnect(reason)) {
    const remainingParticipants = participants.filter(
      ({ id: participantId }) => participantId !== disconnectedParticipant.id
    );

    session.participants = remainingParticipants;

    if (ownerId === disconnectedParticipant.id) {
      // This will be set to `undefined` if there are no participants left
      session.ownerId = remainingParticipants[0]?.id;
    }

    if (!remainingParticipants.length) return;

    namespace
      .to(sessionId)
      .emit('syncSession', parseSafeSessionResponse(session));
    /**
     * If the disconnect was not intentional: broadcast the disconnected participant's disconnected
     * status to the rest of the participants
     */
  } else {
    namespace
      .to(sessionId)
      .emit('syncParticipants', parseSafeParticipantResponse(participants));
  }
}

export default disconnect;
