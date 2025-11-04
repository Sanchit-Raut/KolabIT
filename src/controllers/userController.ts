import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { UserSearchParams, CreateUserSkillData } from '../types';

export class UserController {
  static searchUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: UserSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      skills: req.query.skills ? (req.query.skills as string).split(',') : [],
      department: req.query.department as string,
      year: req.query.year ? parseInt(req.query.year as string) : undefined,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as string) || 'created_at',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await UserService.searchUsers(searchParams);
    ResponseUtils.success(res, result);
  });

  static getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await UserService.getUserById(userId);
    ResponseUtils.success(res, user);
  });

  static getUserSkills = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const skills = await UserService.getUserSkills(userId);
    ResponseUtils.success(res, skills);
  });

  static addUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const skillData: CreateUserSkillData = req.body;
    const userSkill = await UserService.addUserSkill(userId, skillData);
    ResponseUtils.created(res, userSkill, 'Skill added successfully');
  });

  static updateUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { skillId } = req.params;
    const updateData = req.body;
    const userSkill = await UserService.updateUserSkill(userId, skillId, updateData);
    ResponseUtils.success(res, userSkill, 'Skill updated successfully');
  });

  static removeUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { skillId } = req.params;
    const result = await UserService.removeUserSkill(userId, skillId);
    ResponseUtils.success(res, result);
  });

  static endorseUserSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId, skillId } = req.params;
    const result = await UserService.endorseUserSkill(userId, skillId);
    ResponseUtils.success(res, result);
  });

  static getUsersWithSkill = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { skillId } = req.params;
    const searchParams: UserSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      sortBy: (req.query.sortBy as string) || 'created_at',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await UserService.getUsersWithSkill(skillId, searchParams);
    ResponseUtils.success(res, result);
  });

  static getUserStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const stats = await UserService.getUserStats(userId);
    ResponseUtils.success(res, stats);
  });
}
