import { Response, NextFunction } from 'express';
import { JWTUtils } from '../utils/jwt';
import { ResponseUtils } from '../utils/response';
import { AuthRequest } from '../types';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    ResponseUtils.unauthorized(res, 'Access token is required');
    return;
  }

  try {
    const decoded = JWTUtils.verifyToken(token);
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    ResponseUtils.unauthorized(res, 'Invalid or expired token');
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    (req as any).user = undefined;
    next();
    return;
  }

  try {
    const decoded = JWTUtils.verifyToken(token);
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    // Ignore invalid tokens for optional auth
    (req as any).user = undefined;
  }

  next();
};

export const requireVerifiedEmail = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    ResponseUtils.unauthorized(res, 'Authentication required');
    return;
  }

  // This would need to be implemented with a database check
  // For now, we'll assume all authenticated users are verified
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtils.unauthorized(res, 'Authentication required');
      return;
    }

    if (!roles.includes(req.user.role)) {
      ResponseUtils.forbidden(res, 'Insufficient permissions');
      return;
    }

    next();
  };
};
