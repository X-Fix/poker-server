import { Route } from '../definitions';
import { resetSessions } from '../stores/sessionStore';

// eslint-disable-next-line import/prefer-default-export
export const resetRoute: Route = {
  handler: (req, res) => {
    resetSessions();
    res.end();
  },
  url: '/debug/resetSessions',
};
