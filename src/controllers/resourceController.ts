import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resourceService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreateResourceData, UpdateResourceData, ResourceSearchParams, CreateResourceRatingData } from '../types';

export class ResourceController {
  static createResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const uploaderId = (req as any).user.id;
    const resourceData: CreateResourceData = {
      ...req.body,
      file_url: req.file ? `/uploads/${req.file.filename}` : req.body.file_url,
      file_name: req.file ? req.file.originalname : req.body.file_name,
      file_size: req.file ? req.file.size : req.body.file_size,
    };
    
    const resource = await ResourceService.createResource(uploaderId, resourceData);
    ResponseUtils.created(res, resource, 'Resource uploaded successfully');
  });

  static getResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: ResourceSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      subject: req.query.subject as string,
      type: req.query.type as string,
      semester: req.query.semester ? parseInt(req.query.semester as string) : undefined,
      search: req.query.search as string,
      sortBy: (req.query.sortBy as string) || 'created_at',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await ResourceService.getResources(searchParams);
    ResponseUtils.success(res, result);
  });

  static getResourceById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      ResponseUtils.error(res, 'Resource ID is required', 'VALIDATION_ERROR', 400);
      return;
    }
    const resource = await ResourceService.getResourceById(id);
    ResponseUtils.success(res, resource);
  });

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

  static deleteResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const result = await ResourceService.deleteResource(id, userId);
    ResponseUtils.success(res, result);
  });

  static trackDownload = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await ResourceService.trackDownload(id);
    ResponseUtils.success(res, result);
  });

  static rateResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const ratingData: CreateResourceRatingData = req.body;
    const rating = await ResourceService.rateResource(id, userId, ratingData);
    ResponseUtils.success(res, rating, 'Resource rated successfully');
  });

  static getResourceRatings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const ratings = await ResourceService.getResourceRatings(id);
    ResponseUtils.success(res, ratings);
  });

  static getResourceStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const stats = await ResourceService.getResourceStats(id);
    ResponseUtils.success(res, stats);
  });

  static getPopularResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const resources = await ResourceService.getPopularResources(limit);
    ResponseUtils.success(res, resources);
  });
}
