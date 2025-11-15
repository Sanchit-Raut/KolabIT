import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resourceService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreateResourceData, UpdateResourceData, ResourceSearchParams, CreateResourceRatingData } from '../types';

export class ResourceController {
  /**
   * Create new resource
   */
  static createResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const uploaderId = (req as any).user.id;
    const resourceData: CreateResourceData = {
      ...req.body,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl,
      fileName: req.file ? req.file.originalname : req.body.fileName,
      fileSize: req.file ? req.file.size : req.body.fileSize,
    };
    
    const resource = await ResourceService.createResource(uploaderId, resourceData);
    
    ResponseUtils.created(res, resource, 'Resource uploaded successfully');
  });

  /**
   * Get resources with filters
   */
  static getResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: ResourceSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      subject: req.query.subject as string,
      type: req.query.type as string,
      semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await ResourceService.getResources(searchParams);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get resource by ID
   */
  static getResourceById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      ResponseUtils.error(res, 'Resource ID is required', 'VALIDATION_ERROR', 400);
      return;
    }
    
    const resource = await ResourceService.getResourceById(id);
    
    ResponseUtils.success(res, resource);
  });

  /**
   * Update resource
   */
  static updateResource = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdateResourceData = req.body;
    
    if (!id) {
      ResponseUtils.error(res, 'Resource ID is required', 'VALIDATION_ERROR', 400);
      return;
    }
    
    const resource = await ResourceService.updateResource(id, userId, updateData);
    
    ResponseUtils.success(res, resource, 'Resource updated successfully');
  });

  /**
   * Delete resource
   */
  static deleteResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await ResourceService.deleteResource(id, userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Track resource download
   */
  static trackDownload = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const result = await ResourceService.trackDownload(id);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get resources by user ID
   */
  static getResourcesByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const searchParams: ResourceSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      subject: req.query.subject as string,
      type: req.query.type as string,
      semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };
    
    const result = await ResourceService.getResourcesByUser(userId, searchParams);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Rate resource
   */
  static rateResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const ratingData: CreateResourceRatingData = req.body;
    
    const rating = await ResourceService.rateResource(id, userId, ratingData);
    
    ResponseUtils.success(res, rating, 'Resource rated successfully');
  });

  /**
   * Get resource ratings
   */
  static getResourceRatings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const ratings = await ResourceService.getResourceRatings(id);
    
    ResponseUtils.success(res, ratings);
  });

  /**
   * Get resource statistics
   */
  static getResourceStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const stats = await ResourceService.getResourceStats(id);
    
    ResponseUtils.success(res, stats);
  });

  /**
   * Get popular resources
   */
  static getPopularResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const resources = await ResourceService.getPopularResources(limit);
    
    ResponseUtils.success(res, resources);
  });
}
