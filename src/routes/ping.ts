import { Request, Response } from 'express';
import { Route } from './Route';

const ping: Route = {
  handler: (req: Request, response: Response) => {
    response.send('pong');
  },
  url: '/ping',
};

export default ping;
