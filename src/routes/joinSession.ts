import { Route } from '../definitions';
import { joinSession } from '../handlers';

const joinSessionRoute: Route = {
  handler: joinSession,
  url: '/joinSession',
};

export default joinSessionRoute;
