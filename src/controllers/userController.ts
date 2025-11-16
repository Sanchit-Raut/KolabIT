import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { BadgeService } from '../services/badgeService';
import { NotificationService } from '../services/notificationService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { UserSearchParams, CreateUserSkillData } from '../types';

export class UserController {
  /**
   * Search users
   */
  static searchUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log('[UserController] Search query params:', req.query);
    
    const searchParams: UserSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      // Validator normalizes skills to always be an array
      skills: (req.query.skills as string[]) || [],
      department: req.query.department as string,
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    console.log('[UserController] Parsed search params:', searchParams);

    const result = await UserService.searchUsers(searchParams);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get user by ID
   */
  static getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const user = await UserService.getUserById(userId);
    
    ResponseUtils.success(res, user);
  });

  /**
   * Get user skills
   */
  static getUserSkills = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const skills = await UserService.getUserSkills(userId);
    
    ResponseUtils.success(res, skills);
  });

  /**
   * Add skill to user profile
   */
  static addUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const skillData: CreateUserSkillData = req.body;
    
    const userSkill = await UserService.addUserSkill(userId, skillData);
    
    // Check for new badges
    const badgeResult = await BadgeService.checkAndAwardBadges(userId);
    
    // Send notifications for new badges
    if (badgeResult.newBadges.length > 0) {
      for (const badge of badgeResult.newBadges) {
        await NotificationService.createNotification({
          userId,
          type: 'BADGE_EARNED',
          title: `🎉 New Badge Earned: ${badge.name}`,
          message: badge.description,
        });
      }
    }
    
    ResponseUtils.created(res, { 
      userSkill, 
      newBadges: badgeResult.newBadges 
    }, 'Skill added successfully');
  });

  /**
   * Update user skill
   */
  static updateUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { skillId } = req.params;
    const updateData = req.body;
    
    const userSkill = await UserService.updateUserSkill(userId, skillId, updateData);
    
    ResponseUtils.success(res, userSkill, 'Skill updated successfully');
  });

  /**
   * Remove skill from user profile
   */
  static removeUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { skillId } = req.params;
    
    const result = await UserService.removeUserSkill(userId, skillId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Endorse user skill
   */
  static endorseUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, skillId } = req.params;
    
    const result = await UserService.endorseUserSkill(userId, skillId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get users with specific skill
   */
  static getUsersWithSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { skillId } = req.params;
    const searchParams: UserSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await UserService.getUsersWithSkill(skillId, searchParams);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get user statistics
   */
  static getUserStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const stats = await UserService.getUserStats(userId);
    
    ResponseUtils.success(res, stats);
  });
}
