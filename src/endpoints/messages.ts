import { SocketMessage, SubscribePayload } from '../definitions';
import { subscribe as subscribeHandler } from '../handlers';

// eslint-disable-next-line import/prefer-default-export
export const subscribe: SocketMessage<SubscribePayload> = {
  handler: subscribeHandler,
  message: 'subscribe',
};
