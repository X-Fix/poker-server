import { Route } from '../definitions';
import { createSession } from '../handlers';

const createRoom: Route = {
  handler: createSession,
  url: '/createSession',
};

export default createRoom;
