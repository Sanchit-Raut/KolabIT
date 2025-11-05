import { Request, Response, NextFunction } from 'express';
import { CertificationService } from '../services/certificationService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreateCertificationData, UpdateCertificationData } from '../types';

export class CertificationController {
  /**
   * Create new certification
   */
  static createCertification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const certData: CreateCertificationData = req.body;
    
    const certification = await CertificationService.createCertification(userId, certData);
    
    ResponseUtils.created(res, certification, 'Certification added successfully');
  });

  /**
   * Get all certifications for logged-in user
   */
  static getMyCertifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const certifications = await CertificationService.getUserCertifications(userId);
    
    ResponseUtils.success(res, certifications);
  });

  /**
   * Get certifications for specific user
   */
  static getUserCertifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const certifications = await CertificationService.getUserCertifications(userId);
    
    ResponseUtils.success(res, certifications);
  });

  /**
   * Get certification by ID
   */
  static getCertificationById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const certification = await CertificationService.getCertificationById(id, userId);
    
    ResponseUtils.success(res, certification);
  });

  /**
   * Update certification
   */
  static updateCertification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdateCertificationData = req.body;
    
    const certification = await CertificationService.updateCertification(id, userId, updateData);
    
    ResponseUtils.success(res, certification, 'Certification updated successfully');
  });

  /**
   * Delete certification
   */
  static deleteCertification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await CertificationService.deleteCertification(id, userId);
    
    ResponseUtils.success(res, result);
  });
}
