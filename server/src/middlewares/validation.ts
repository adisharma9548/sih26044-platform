import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // simple validation placeholder
    next();
  };
};