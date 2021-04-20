import { Namespace, Socket } from 'socket.io';
import { RemoveParticipantPayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';
import { parseSafeSessionResponse } from '../utils';

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

  const removedSocketId = removedParticipant?.socketId;

  if (removedSocketId) {
    const removedSocket = namespace.sockets.get(removedSocketId);

    // Unsubscribe the removed participant from the socket group (room)
    removedSocket?.leave(sessionId);

    // Notify the socket client they have been removed and close connection
    removedSocket?.emit('removed');
    removedSocket?.disconnect(true);
  }

  // Filter out the removed participant
  const filteredParticipants = participants.filter(
    ({ id }) => id !== participantId
  );
  session.participants = filteredParticipants;

  /**
   * Similar to when a participant leaves the session, re-assess if all remaining participants have
   * finished voting
   */
  console.log(session.phase);
  if (
    session.phase === 'voting' &&
    filteredParticipants.every(
      ({ isActive, vote }) => !isActive || Boolean(vote)
    )
  ) {
    session.phase = 'result';
    console.log('changed phase');
  }

  // Broadcast update to all subscribers of the socket group (room)
  namespace
    .to(sessionId)
    .emit('syncSession', parseSafeSessionResponse(session));
}

export default removeParticipant;
