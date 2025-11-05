import { PrismaClient } from '@prisma/client';
import { CreatePortfolioData, UpdatePortfolioData } from '../types';

const prisma = new PrismaClient();

export class PortfolioService {
  /**
   * Create new portfolio item
   */
  static async createPortfolio(userId: string, data: CreatePortfolioData) {
    try {
      const portfolio = await prisma.portfolio.create({
        data: {
          userId,
          title: data.title,
          link: data.link,
          description: data.description,
          imageUrl: data.imageUrl,
          order: data.order || 0,
        },
      });

      return portfolio;
    } catch (error: any) {
      throw new Error('Failed to create portfolio item');
    }
  }

  /**
   * Get all portfolio items for a user
   */
  static async getUserPortfolios(userId: string) {
    try {
      const portfolios = await prisma.portfolio.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      });

      return portfolios;
    } catch (error: any) {
      throw new Error('Failed to fetch portfolio items');
    }
  }

  /**
   * Get portfolio item by ID
   */
  static async getPortfolioById(id: string, userId: string) {
    try {
      const portfolio = await prisma.portfolio.findFirst({
        where: { id, userId },
      });

      if (!portfolio) {
        throw new Error('Portfolio item not found');
      }

      return portfolio;
    } catch (error: any) {
      if (error.message === 'Portfolio item not found') throw error;
      throw new Error('Failed to fetch portfolio item');
    }
  }

  /**
   * Update portfolio item
   */
  static async updatePortfolio(id: string, userId: string, data: UpdatePortfolioData) {
    try {
      // Check ownership
      const existing = await prisma.portfolio.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error('Portfolio item not found');
      }

      const portfolio = await prisma.portfolio.update({
        where: { id },
        data,
      });

      return portfolio;
    } catch (error: any) {
      if (error.message === 'Portfolio item not found') throw error;
      throw new Error('Failed to update portfolio item');
    }
  }

  /**
   * Delete portfolio item
   */
  static async deletePortfolio(id: string, userId: string) {
    try {
      // Check ownership
      const existing = await prisma.portfolio.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error('Portfolio item not found');
      }

      await prisma.portfolio.delete({
        where: { id },
      });

      return { message: 'Portfolio item deleted successfully' };
    } catch (error: any) {
      if (error.message === 'Portfolio item not found') throw error;
      throw new Error('Failed to delete portfolio item');
    }
  }

  /**
   * Reorder portfolio items
   */
  static async reorderPortfolios(userId: string, itemIds: string[]) {
    try {
      // Update each item's order
      const updatePromises = itemIds.map((id, index) =>
        prisma.portfolio.updateMany({
          where: { id, userId },
          data: { order: index },
        })
      );

      await Promise.all(updatePromises);

      return { message: 'Portfolio items reordered successfully' };
    } catch (error: any) {
      throw new Error('Failed to reorder portfolio items');
    }
  }
}
