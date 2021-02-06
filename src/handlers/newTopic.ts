import { Namespace, Socket } from 'socket.io';
import { NewTopicPayload } from '../definitions';
import { getSessionById } from '../stores/sessionStore';

function newTopic(
  { sessionId, topic }: NewTopicPayload,
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

  // Set session topic to new value
  session.topic = topic;

  // Reset the vote value for all participants
  participants.forEach((participant) => {
    // eslint-disable-next-line no-param-reassign
    delete participant.vote;
  });

  // Broadcast update to all subscribers of the socket group (room)
  namespace.to(sessionId).emit('sync', session);
}

export default newTopic;
