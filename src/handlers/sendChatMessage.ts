import { Namespace, Socket } from 'socket.io';
import { SendChatMessagePayload } from '../definitions';
import ChatMessage from '../definitions/ChatMessage';
import { getSessionById } from '../stores/sessionStore';

function sendChatMessage(
  { messageText, sessionId }: SendChatMessagePayload,
  socket: Socket,
  namespace: Namespace
): void {
  const session = getSessionById(sessionId);
  const { participants } = session;

  const actingParticipant = participants.find(
    ({ socketId }) => socketId === socket.id
  );

  if (!actingParticipant) return;

  const newChatMessage = new ChatMessage(actingParticipant, messageText);

  if (session.chatMessages?.length) {
    // eslint-disable-next-line no-plusplus
    for (let i = session.chatMessages.length; i > 0; i--) {
      if (newChatMessage.dateMillis > session.chatMessages[i].dateMillis) {
        session.chatMessages.splice(i + 1, 0, newChatMessage);
        break;
      }
    }
  } else {
    session.chatMessages = [newChatMessage];
  }

  console.log('syncChat');

  namespace.to(sessionId).emit('syncChat', session.chatMessages);
}

export default sendChatMessage;
