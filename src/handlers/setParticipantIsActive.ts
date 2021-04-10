import { Namespace, Socket } from 'socket.io';
import { SetParticipantIsActivePayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';

function setParticipantIsActive(
  { isActive, participantId, sessionId }: SetParticipantIsActivePayload,
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

  const targetParticipant = participants.find(({ id }) => id === participantId);

  // Ignore if target participant can't be found
  if (!targetParticipant) return;

  // Set isActive to specified value
  targetParticipant.isActive = isActive;

  // Broadcast update to all subscribers of the socket group (room)
  namespace.to(sessionId).emit('syncParticipants', participants);
}

export default setParticipantIsActive;
