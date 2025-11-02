import { Request, Response, NextFunction } from 'express';
import { BadgeService } from '../services/badgeService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';

export class BadgeController {
  /**
   * Get all available badges
   */
  static getAllBadges = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const badges = await BadgeService.getAllBadges();
    
    ResponseUtils.success(res, badges);
  });

  /**
   * Get user's badges
   */
  static getUserBadges = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const badges = await BadgeService.getUserBadges(userId);
    
    ResponseUtils.success(res, badges);
  });

  /**
   * Check and award badges
   */
  static checkAndAwardBadges = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const result = await BadgeService.checkAndAwardBadges(userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get leaderboard
   */
  static getLeaderboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { skillId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const leaderboard = await BadgeService.getLeaderboard(skillId, limit);
    
    ResponseUtils.success(res, leaderboard);
  });
}
