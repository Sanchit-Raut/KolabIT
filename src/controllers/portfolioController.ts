import { Request, Response, NextFunction } from 'express';
import { PortfolioService } from '../services/portfolioService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreatePortfolioData, UpdatePortfolioData } from '../types';

export class PortfolioController {
  /**
   * Create new portfolio item
   */
  static createPortfolio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const portfolioData: CreatePortfolioData = req.body;
    
    const portfolio = await PortfolioService.createPortfolio(userId, portfolioData);
    
    ResponseUtils.created(res, portfolio, 'Portfolio item added successfully');
  });

  /**
   * Get all portfolio items for logged-in user
   */
  static getMyPortfolios = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const portfolios = await PortfolioService.getUserPortfolios(userId);
    
    ResponseUtils.success(res, portfolios);
  });

  /**
   * Get portfolio items for specific user
   */
  static getUserPortfolios = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const portfolios = await PortfolioService.getUserPortfolios(userId);
    
    ResponseUtils.success(res, portfolios);
  });

  /**
   * Get portfolio item by ID
   */
  static getPortfolioById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const portfolio = await PortfolioService.getPortfolioById(id, userId);
    
    ResponseUtils.success(res, portfolio);
  });

  /**
   * Update portfolio item
   */
  static updatePortfolio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdatePortfolioData = req.body;
    
    const portfolio = await PortfolioService.updatePortfolio(id, userId, updateData);
    
    ResponseUtils.success(res, portfolio, 'Portfolio item updated successfully');
  });

  /**
   * Delete portfolio item
   */
  static deletePortfolio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await PortfolioService.deletePortfolio(id, userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Reorder portfolio items
   */
  static reorderPortfolios = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { itemIds } = req.body;
    
    const result = await PortfolioService.reorderPortfolios(userId, itemIds);
    
    ResponseUtils.success(res, result);
  });
}
