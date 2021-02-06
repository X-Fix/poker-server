import {
  SocketMessage,
  SubscribePayload,
  SetParticipantIsActivePayload,
  NewTopicPayload,
} from '../definitions';
import {
  newTopic as newTopicHandler,
  subscribe as subscribeHandler,
  setParticipantIsActive as setParticipantIsActiveHandler,
} from '../handlers';

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
