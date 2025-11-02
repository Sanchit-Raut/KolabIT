import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';

export class NotificationController {
  /**
   * Get user notifications
   */
  static getNotifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    const result = await NotificationService.getNotifications(userId, page, limit);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Mark notification as read
   */
  static markAsRead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await NotificationService.markAsRead(id, userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Mark all notifications as read
   */
  static markAllAsRead = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const result = await NotificationService.markAllAsRead(userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Delete notification
   */
  static deleteNotification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await NotificationService.deleteNotification(id, userId);
    
    ResponseUtils.success(res, result);
  });
}
