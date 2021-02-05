import { Route } from '../definitions';
import { createSession } from '../handlers';

const createSessionRoute: Route = {
  handler: createSession,
  url: '/createSession',
};

export default createSessionRoute;
