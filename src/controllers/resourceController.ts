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
    const resourceData: any = {
      ...req.body,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl,
      fileName: req.file ? req.file.originalname : req.body.fileName,
      fileSize: req.file ? req.file.size : req.body.fileSize,
    };
    
    // Parse semester to integer if provided
    if (resourceData.semester) {
      const parsed = parseInt(String(resourceData.semester), 10);
      resourceData.semester = isNaN(parsed) ? undefined : parsed;
    }

    // Parse articleLinks if sent as a JSON string (from form-data)
    if (resourceData.articleLinks && typeof resourceData.articleLinks === 'string') {
      try {
        resourceData.articleLinks = JSON.parse(resourceData.articleLinks);
      } catch (err) {
        console.error('[v0] Failed to parse articleLinks:', err);
        resourceData.articleLinks = undefined;
      }
    }

    // Ensure youtubeUrl is a string (not an object or other type)
    if (resourceData.youtubeUrl && typeof resourceData.youtubeUrl !== 'string') {
      resourceData.youtubeUrl = String(resourceData.youtubeUrl);
    }
    
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
    const updateData: any = req.body;
    
    if (!id) {
      ResponseUtils.error(res, 'Resource ID is required', 'VALIDATION_ERROR', 400);
      return;
    }

    // Parse semester to integer if provided
    if (updateData.semester) {
      const parsed = parseInt(String(updateData.semester), 10);
      updateData.semester = isNaN(parsed) ? undefined : parsed;
    }

    // Parse articleLinks if sent as a JSON string
    if (updateData.articleLinks && typeof updateData.articleLinks === 'string') {
      try {
        updateData.articleLinks = JSON.parse(updateData.articleLinks);
      } catch (err) {
        console.error('[v0] Failed to parse articleLinks:', err);
        updateData.articleLinks = undefined;
      }
    }

    // Ensure youtubeUrl is a string if provided
    if (updateData.youtubeUrl && typeof updateData.youtubeUrl !== 'string') {
      updateData.youtubeUrl = String(updateData.youtubeUrl);
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
