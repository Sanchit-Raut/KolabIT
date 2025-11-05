import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';

export class AnalyticsController {
  /**
   * Get analytics for logged-in user
   */
  static getMyAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const analytics = await AnalyticsService.getOrCreateAnalytics(userId);
    
    ResponseUtils.success(res, analytics);
  });

  /**
   * Get analytics report for logged-in user
   */
  static getMyReport = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const report = await AnalyticsService.generateReport(userId);
    
    ResponseUtils.success(res, report);
  });

  /**
   * Get engagement score for logged-in user
   */
  static getMyEngagementScore = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const score = await AnalyticsService.getEngagementScore(userId);
    
    ResponseUtils.success(res, score);
  });

  /**
   * Get public analytics for a user (admin/public view)
   */
  static getUserAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    // Increment profile views for the viewed user
    await AnalyticsService.incrementProfileViews(userId);
    
    const analytics = await AnalyticsService.getOrCreateAnalytics(userId);
    
    ResponseUtils.success(res, analytics);
  });
}
