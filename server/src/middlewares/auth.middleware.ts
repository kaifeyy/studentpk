import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = verify(token, config.JWT_SECRET) as { userId: string; role: string };
      
      // Check if user has required role
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Not authorized to access this route' });
      }

      // Add user to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export const studentAuth = authMiddleware(['student']);
export const adminAuth = authMiddleware(['admin']);
export const anyAuth = authMiddleware(['student', 'admin']);
