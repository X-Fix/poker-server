import {
  SocketMessage,
  SubscribePayload,
  SetParticipantIsActivePayload,
  NewTopicPayload,
  SetVotePayload,
  RemoveParticipantPayload,
} from '../definitions';
import {
  newTopic as newTopicHandler,
  removeParticipant as removeParticipantHandler,
  subscribe as subscribeHandler,
  setParticipantIsActive as setParticipantIsActiveHandler,
  setVote as setVoteHandler,
} from '../handlers';

export const removeParticipant: SocketMessage<RemoveParticipantPayload> = {
  handler: removeParticipantHandler,
  message: 'setActive',
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
