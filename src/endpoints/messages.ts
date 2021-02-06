import {
  SocketMessage,
  SubscribePayload,
  SetParticipantIsActivePayload,
} from '../definitions';
import {
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
