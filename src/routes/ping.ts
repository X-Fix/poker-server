import { Request, Response } from 'express';
import { Route } from '../definitions';

const ping: Route = {
  handler: (req: Request, response: Response) => {
    response.send('pong');
  },
  url: '/ping',
};

export default ping;
