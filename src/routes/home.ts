import { Request, Response } from 'express';
import { Route } from './Route';

const home: Route = {
  handler: (req: Request, response: Response) => {
    response.send({ status: 'ok' });
  },
  url: '/',
};

export default home;