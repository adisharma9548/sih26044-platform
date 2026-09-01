import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { sendError } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(sendError('MISSING_TOKEN', 'Authentication required'));
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(sendError('INVALID_TOKEN', 'Invalid or expired token'));
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(sendError('UNAUTHORIZED', 'Not authenticated'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(sendError('FORBIDDEN', 'Insufficient permissions'));
    }
    next();
  };
};