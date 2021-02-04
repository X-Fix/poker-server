import { Request, Response } from 'express';

export interface Route {
  handler: (req: Request, res: Response) => void;
  url: string;
}
