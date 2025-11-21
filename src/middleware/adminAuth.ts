import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ResponseUtils } from '../utils/response';

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return ResponseUtils.error(res, 'Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isBanned: true },
    });

    if (!user) {
      return ResponseUtils.error(res, 'User not found', 404);
    }

    if (user.isBanned) {
      return ResponseUtils.error(res, 'Your account has been banned', 403);
    }

    if (user.role !== 'ADMIN') {
      return ResponseUtils.error(res, 'Admin access required', 403);
    }

    next();
  } catch (error) {
    return ResponseUtils.error(res, 'Authorization failed', 500);
  }
};

/**
 * Middleware to check if user is banned
 */
export const checkBanned = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isBanned: true },
    });

    if (user?.isBanned) {
      return ResponseUtils.error(res, 'Your account has been banned. Please contact support.', 403);
    }

    next();
  } catch (error) {
    return ResponseUtils.error(res, 'Authorization check failed', 500);
  }
};
