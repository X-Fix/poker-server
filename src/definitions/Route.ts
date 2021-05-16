import { Request, Response } from 'express';

interface Route {
  handler: (req: Request, res: Response) => void;
  url: string | RegExp;
}

export default Route;
