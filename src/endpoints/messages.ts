import {
  SocketMessage,
  SubscribePayload,
  SetParticipantIsActivePayload,
  NewTopicPayload,
  SetVotePayload,
  RemoveParticipantPayload,
  LeaveSessionPayload,
  DisconnectPayload,
} from '../definitions';
import {
  disconnect as disconnectHandler,
  leaveSession as leaveSessionHandler,
  newTopic as newTopicHandler,
  removeParticipant as removeParticipantHandler,
  subscribe as subscribeHandler,
  setParticipantIsActive as setParticipantIsActiveHandler,
  setVote as setVoteHandler,
} from '../handlers';

export const pong: SocketMessage<unknown> = {
  handler: (empty, socket) => {
    console.log('heard ping');
    socket.emit('pong');
  },
  message: 'ping',
};

export const disconnect: SocketMessage<DisconnectPayload> = {
  handler: disconnectHandler,
  message: 'disconnect',
};

export const leaveSession: SocketMessage<LeaveSessionPayload> = {
  handler: leaveSessionHandler,
  message: 'leaveSession',
};

export const removeParticipant: SocketMessage<RemoveParticipantPayload> = {
  handler: removeParticipantHandler,
  message: 'removeParticipant',
};

export const setParticipantIsActive: SocketMessage<SetParticipantIsActivePayload> = {
  handler: setParticipantIsActiveHandler,
  message: 'setActive',
};

export const subscribe: SocketMessage<SubscribePayload> = {
  handler: subscribeHandler,
  message: 'subscribe',
};

export const newTopic: SocketMessage<NewTopicPayload> = {
  handler: newTopicHandler,
  message: 'newTopic',
};

export const setVote: SocketMessage<SetVotePayload> = {
  handler: setVoteHandler,
  message: 'setVote',
};
