import prisma from '../config/database';
import { BadgeData, UserBadgeData, PaginatedResponse } from '../types';

export class BadgeService {
  /**
   * Get all available badges
   */
  static async getAllBadges(): Promise<BadgeData[]> {
    const badges = await prisma.badge.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return badges.map(badge => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category as 'SKILL' | 'CONTRIBUTION' | 'ACHIEVEMENT' | 'SPECIAL',
      criteria: badge.criteria,
    }));
  }

  /**
   * Get user's badges
   */
  static async getUserBadges(userId: string): Promise<UserBadgeData[]> {
    const userBadges = await prisma.user_badge.findMany({
      where: { user_id: userId },
      include: {
        badge: true,
      },
      orderBy: { earned_at: 'desc' },
    });

    return userBadges.map(ub => ({
      id: ub.id,
      userId: ub.user_id,
      badgeId: ub.badge_id,
      earnedAt: ub.earned_at,
      badge: {
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        category: ub.badge.category as 'SKILL' | 'CONTRIBUTION' | 'ACHIEVEMENT' | 'SPECIAL',
        criteria: ub.badge.criteria,
      },
    }));
  }

  /**
   * Check and award badges
   */
  static async checkAndAwardBadges(userId: string): Promise<{ message: string; newBadges: BadgeData[] }> {
    const newBadges: BadgeData[] = [];

    // Get user's current badges
    const userBadges = await prisma.user_badge.findMany({
      where: { user_id: userId },
      select: { badge_id: true },
    });

    const userBadgeIds = userBadges.map(ub => ub.badge_id);

    // Get all available badges
    const allBadges = await prisma.badge.findMany();

    // Check each badge criteria
    for (const badge of allBadges) {
      if (userBadgeIds.includes(badge.id)) {
        continue; // User already has this badge
      }

      let shouldAward = false;

      try {
        const criteria = JSON.parse(badge.criteria);
        
        switch (badge.category) {
          case 'SKILL':
            shouldAward = await this.checkSkillBadgeCriteria(userId, criteria);
            break;
          case 'CONTRIBUTION':
            shouldAward = await this.checkContributionBadgeCriteria(userId, criteria);
            break;
          case 'ACHIEVEMENT':
            shouldAward = await this.checkAchievementBadgeCriteria(userId, criteria);
            break;
          case 'SPECIAL':
            shouldAward = await this.checkSpecialBadgeCriteria(userId, criteria);
            break;
        }

        if (shouldAward) {
          // Award the badge
          await prisma.user_badge.create({
            data: {
              user_id: userId,
              badge_id: badge.id,
            },
          });

          newBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            category: badge.category as 'SKILL' | 'CONTRIBUTION' | 'ACHIEVEMENT' | 'SPECIAL',
            criteria: badge.criteria,
          });
        }
      } catch (error) {
        console.error(`Error checking badge criteria for ${badge.name}:`, error);
      }
    }

    return {
      message: newBadges.length > 0 ? `${newBadges.length} new badges earned!` : 'No new badges earned',
      newBadges,
    };
  }

  /**
   * Check skill badge criteria
   */
  private static async checkSkillBadgeCriteria(userId: string, criteria: any): Promise<boolean> {
    const { minSkills, minProficiency, minEndorsements } = criteria;

    const userSkills = await prisma.user_skill.findMany({
      where: { user_id: userId },
    });

    if (minSkills && userSkills.length < minSkills) {
      return false;
    }

    if (minProficiency) {
      const proficiencyValues = {
        BEGINNER: 1,
        INTERMEDIATE: 2,
        ADVANCED: 3,
        EXPERT: 4,
      };

      const hasMinProficiency = userSkills.some(us => 
        proficiencyValues[us.proficiency as keyof typeof proficiencyValues] >= 
        proficiencyValues[minProficiency as keyof typeof proficiencyValues]
      );

      if (!hasMinProficiency) {
        return false;
      }
    }

    if (minEndorsements) {
      const totalEndorsements = userSkills.reduce((sum, us) => sum + us.endorsements, 0);
      if (totalEndorsements < minEndorsements) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check contribution badge criteria
   */
  private static async checkContributionBadgeCriteria(userId: string, criteria: any): Promise<boolean> {
    const { minProjects, minResources, minPosts, minComments } = criteria;

    const [projectCount, resourceCount, postCount, commentCount] = await Promise.all([
      minProjects ? prisma.project_member.count({ where: { user_id: userId } }) : 0,
      minResources ? prisma.resource.count({ where: { uploader_id: userId } }) : 0,
      minPosts ? prisma.post.count({ where: { author_id: userId } }) : 0,
      minComments ? prisma.comment.count({ where: { author_id: userId } }) : 0,
    ]);

    if (minProjects && projectCount < minProjects) return false;
    if (minResources && resourceCount < minResources) return false;
    if (minPosts && postCount < minPosts) return false;
    if (minComments && commentCount < minComments) return false;

    return true;
  }

  /**
   * Check achievement badge criteria
   */
  private static async checkAchievementBadgeCriteria(userId: string, criteria: any): Promise<boolean> {
    const { minDownloads, minLikes, minRatings } = criteria;

    const [resourceDownloads, postLikes, resourceRatings] = await Promise.all([
      minDownloads ? prisma.resource.aggregate({
        where: { uploader_id: userId },
        _sum: { downloads: true },
      }) : { _sum: { downloads: 0 } },
      minLikes ? prisma.like.count({
        where: { post: { author_id: userId } },
      }) : 0,
      minRatings ? prisma.resource_rating.count({
        where: { resource: { uploader_id: userId } },
      }) : 0,
    ]);

    if (minDownloads && (resourceDownloads._sum.downloads || 0) < minDownloads) return false;
    if (minLikes && postLikes < minLikes) return false;
    if (minRatings && resourceRatings < minRatings) return false;

    return true;
  }

  /**
   * Check special badge criteria
   */
  private static async checkSpecialBadgeCriteria(userId: string, criteria: any): Promise<boolean> {
    const { type, value } = criteria;

    switch (type) {
      case 'FIRST_PROJECT':
        const projectCount = await prisma.project_member.count({ where: { user_id: userId } });
        return projectCount >= 1;
      
      case 'FIRST_RESOURCE':
        const resourceCount = await prisma.resource.count({ where: { uploader_id: userId } });
        return resourceCount >= 1;
      
      case 'FIRST_POST':
        const postCount = await prisma.post.count({ where: { author_id: userId } });
        return postCount >= 1;
      
      case 'VERIFIED_USER':
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { is_verified: true },
        });
        return user?.is_verified || false;
      
      default:
        return false;
    }
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(skillId?: string, limit: number = 10): Promise<Array<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    score: number;
    badges: number;
  }>> {
    let whereClause: any = {};

    if (skillId) {
      whereClause.user_skills = {
        some: {
          skill_id: skillId,
        },
      };
    }

    const users = await prisma.user.findMany({
      where: {
        ...whereClause,
        is_verified: true,
      },
      include: {
        user_skills: {
          include: {
            skill: true,
          },
        },
        user_badges: true,
        resources: {
          select: { downloads: true },
        },
        posts: {
          include: {
            likes: true,
          },
        },
      },
      take: limit,
    });

    const leaderboard = users.map(user => {
      // Calculate score based on various factors
      const skillScore = user.user_skills.reduce((sum, us) => sum + us.endorsements, 0);
      const resourceScore = user.resources.reduce((sum, r) => sum + r.downloads, 0);
      const postScore = user.posts.reduce((sum, p) => sum + p.likes.length, 0);
      const badgeScore = user.user_badges.length * 10;

      const totalScore = skillScore + resourceScore + postScore + badgeScore;

      return {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar ?? undefined,
        },
        score: totalScore,
        badges: user.user_badges.length,
      };
    });

    return leaderboard.sort((a, b) => b.score - a.score);
  }
}