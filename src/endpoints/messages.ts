import {
  SocketMessage,
  SetParticipantIsActivePayload,
  NewTopicPayload,
  SetVotePayload,
  RemoveParticipantPayload,
  DisconnectPayload,
} from '../definitions';
import {
  disconnect as disconnectHandler,
  newTopic as newTopicHandler,
  removeParticipant as removeParticipantHandler,
  setParticipantIsActive as setParticipantIsActiveHandler,
  setVote as setVoteHandler,
} from '../handlers';

export const pong: SocketMessage<unknown> = {
  handler: (empty, socket) => {
    socket.emit('pong');
  },
  message: 'ping',
};

export const disconnect: SocketMessage<DisconnectPayload> = {
  handler: disconnectHandler,
  message: 'disconnect',
};

export const removeParticipant: SocketMessage<RemoveParticipantPayload> = {
  handler: removeParticipantHandler,
  message: 'removeParticipant',
};

export const setParticipantIsActive: SocketMessage<SetParticipantIsActivePayload> = {
  handler: setParticipantIsActiveHandler,
  message: 'setActive',
};

export const newTopic: SocketMessage<NewTopicPayload> = {
  handler: newTopicHandler,
  message: 'newTopic',
};

export const setVote: SocketMessage<SetVotePayload> = {
  handler: setVoteHandler,
  message: 'setVote',
};
