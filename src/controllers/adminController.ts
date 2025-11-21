import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export class AdminController {
  /**
   * Ban a user
   */
  static banUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { userId } = req.params;
    const { reason } = req.body;

    const result = await AdminService.banUser(adminId, userId, reason);
    ResponseUtils.success(res, result, 'User banned successfully');
  });

  /**
   * Unban a user
   */
  static unbanUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { userId } = req.params;

    const result = await AdminService.unbanUser(adminId, userId);
    ResponseUtils.success(res, result, 'User unbanned successfully');
  });

  /**
   * Delete a user
   */
  static deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { userId } = req.params;
    const { reason } = req.body;

    const result = await AdminService.deleteUserByAdmin(adminId, userId, reason);
    ResponseUtils.success(res, result, 'User deleted successfully');
  });

  /**
   * Warn a user
   */
  static warnUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { userId } = req.params;
    const { reason, message, severity } = req.body;

    const result = await AdminService.warnUser(adminId, userId, reason, message, severity);
    ResponseUtils.success(res, result, 'Warning issued successfully');
  });

  /**
   * Delete a comment
   */
  static deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { commentId } = req.params;
    const { reason, warnUser = true } = req.body;

    const result = await AdminService.deleteComment(adminId, commentId, reason, warnUser);
    ResponseUtils.success(res, result, 'Comment deleted successfully');
  });

  /**
   * Delete a rating
   */
  static deleteRating = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { ratingId } = req.params;
    const { reason, warnUser = true } = req.body;

    const result = await AdminService.deleteRating(adminId, ratingId, reason, warnUser);
    ResponseUtils.success(res, result, 'Rating deleted successfully');
  });

  /**
   * Delete a project
   */
  static deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { projectId } = req.params;
    const { reason, warnUser = true } = req.body;

    const result = await AdminService.deleteProject(adminId, projectId, reason, warnUser);
    ResponseUtils.success(res, result, 'Project deleted successfully');
  });

  /**
   * Delete a post
   */
  static deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { postId } = req.params;
    const { reason, warnUser = true } = req.body;

    const result = await AdminService.deletePost(adminId, postId, reason, warnUser);
    ResponseUtils.success(res, result, 'Post deleted successfully');
  });

  /**
   * Delete a resource
   */
  static deleteResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { resourceId } = req.params;
    const { reason, warnUser = true } = req.body;

    const result = await AdminService.deleteResource(adminId, resourceId, reason, warnUser);
    ResponseUtils.success(res, result, 'Resource deleted successfully');
  });

  /**
   * Get all admin actions (audit log)
   */
  static getAdminActions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await AdminService.getAdminActions(adminId, limit, offset);
    ResponseUtils.success(res, result);
  });

  /**
   * Get user warnings
   */
  static getUserWarnings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const { userId } = req.params;

    const result = await AdminService.getUserWarnings(adminId, userId);
    ResponseUtils.success(res, result);
  });

  /**
   * Get all users
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const result = await AdminService.getAllUsers(adminId, page, limit, search);
    ResponseUtils.success(res, result);
  });

  /**
   * Get all banned users
   */
  static getBannedUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getBannedUsers();
    ResponseUtils.success(res, result);
  });

  /**
   * Get all warnings
   */
  static getAllWarnings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllWarnings();
    ResponseUtils.success(res, result);
  });
}
