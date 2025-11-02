import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreateUserData } from '../types';

export class AuthController {
  /**
   * Register new user
   */
  static register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserData = req.body;
    
    const result = await AuthService.register(userData);
    
    ResponseUtils.created(res, result, 'User registered successfully. Please check your email for verification.');
  });

  /**
   * Login user
   */
  static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    const result = await AuthService.login(email, password);
    
    ResponseUtils.success(res, result, 'Login successful');
  });

  /**
   * Verify email
   */
  static verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    
    const result = await AuthService.verifyEmail(token);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Forgot password
   */
  static forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    
    const result = await AuthService.forgotPassword(email);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Reset password
   */
  static resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;
    
    const result = await AuthService.resetPassword(token, password);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get user profile
   */
  static getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const user = await AuthService.getUserProfile(userId);
    
    ResponseUtils.success(res, user);
  });

  /**
   * Update user profile
   */
  static updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const updateData = req.body;
    
    const user = await AuthService.updateUserProfile(userId, updateData);
    
    ResponseUtils.success(res, user, 'Profile updated successfully');
  });

  /**
   * Change password
   */
  static changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;
    
    const result = await AuthService.changePassword(userId, currentPassword, newPassword);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Delete user account
   */
  static deleteAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const result = await AuthService.deleteUser(userId);
    
    ResponseUtils.success(res, result);
  });
}
