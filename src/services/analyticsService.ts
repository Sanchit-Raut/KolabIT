import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  /**
   * Get or create analytics for a user
   */
  static async getOrCreateAnalytics(userId: string) {
    try {
      let analytics = await prisma.analytic.findUnique({
        where: { userId },
      });

      if (!analytics) {
        analytics = await prisma.analytic.create({
          data: { userId },
        });
      }

      return analytics;
    } catch (error: any) {
      throw new Error('Failed to fetch analytics');
    }
  }

  /**
   * Increment profile views
   */
  static async incrementProfileViews(userId: string) {
    try {
      const analytics = await prisma.analytic.upsert({
        where: { userId },
        update: {
          profileViews: { increment: 1 },
          lastViewedAt: new Date(),
        },
        create: {
          userId,
          profileViews: 1,
          lastViewedAt: new Date(),
        },
      });

      return analytics;
    } catch (error: any) {
      throw new Error('Failed to increment profile views');
    }
  }

  /**
   * Increment project invites count
   */
  static async incrementProjectInvites(userId: string) {
    try {
      const analytics = await prisma.analytic.upsert({
        where: { userId },
        update: {
          projectInvites: { increment: 1 },
        },
        create: {
          userId,
          projectInvites: 1,
        },
      });

      return analytics;
    } catch (error: any) {
      throw new Error('Failed to increment project invites');
    }
  }

  /**
   * Update ratings average
   */
  static async updateRatingsAverage(userId: string, newRating: number) {
    try {
      const analytics = await this.getOrCreateAnalytics(userId);

      const totalRatings = analytics.ratingsAvg * analytics.ratingsCount;
      const newCount = analytics.ratingsCount + 1;
      const newAverage = (totalRatings + newRating) / newCount;

      const updated = await prisma.analytic.update({
        where: { userId },
        data: {
          ratingsAvg: newAverage,
          ratingsCount: newCount,
        },
      });

      return updated;
    } catch (error: any) {
      throw new Error('Failed to update ratings average');
    }
  }

  /**
   * Generate analytics report
   */
  static async generateReport(userId: string) {
    try {
      const analytics = await this.getOrCreateAnalytics(userId);

      // Get additional stats
      const [projectCount, postCount, skillCount] = await Promise.all([
        prisma.project.count({ where: { ownerId: userId } }),
        prisma.post.count({ where: { authorId: userId } }),
        prisma.userSkill.count({ where: { userId } }),
      ]);

      return {
        ...analytics,
        projectsCreated: projectCount,
        postsCreated: postCount,
        skillsListed: skillCount,
      };
    } catch (error: any) {
      throw new Error('Failed to generate analytics report');
    }
  }

  /**
   * Get engagement score
   */
  static async getEngagementScore(userId: string) {
    try {
      const report = await this.generateReport(userId);

      // Calculate engagement score based on various metrics
      const score =
        (report.profileViews * 0.1) +
        (report.projectInvites * 2) +
        (report.ratingsAvg * 5) +
        (report.projectsCreated * 3) +
        (report.postsCreated * 1) +
        (report.skillsListed * 0.5);

      return {
        score: Math.round(score * 100) / 100,
        metrics: report,
      };
    } catch (error: any) {
      throw new Error('Failed to calculate engagement score');
    }
  }
}
