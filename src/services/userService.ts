import prisma from '../config/database';
import { UserProfile, UserSearchParams, CreateUserSkillData, UserSkillData, PaginatedResponse } from '../types';

export class UserService {
  /**
   * Search users with filters
   */
  static async searchUsers(params: UserSearchParams): Promise<PaginatedResponse<UserProfile>> {
    const {
      page = 1,
      limit = 20,
      skills = [],
      department,
      year,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isVerified: true,
    };

    if (department) {
      where.department = {
        contains: department,
        mode: 'insensitive',
      };
    }

    if (year) {
      where.year = year;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (skills.length > 0) {
      where.userSkills = {
        some: {
          skillId: { in: skills },
        },
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          department: true,
          year: true,
          semester: true,
          bio: true,
          avatar: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users as UserProfile[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        rollNumber: true,
        department: true,
        year: true,
        semester: true,
        bio: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user as UserProfile;
  }

  /**
   * Get user skills
   */
  static async getUserSkills(userId: string): Promise<UserSkillData[]> {
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
      orderBy: { endorsements: 'desc' },
    });

    return userSkills.map(us => ({
      id: us.id,
      userId: us.userId,
      skillId: us.skillId,
      proficiency: us.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      yearsOfExp: us.yearsOfExp ?? undefined,
      endorsements: us.endorsements,
      skill: {
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category,
        description: us.skill.description ?? undefined,
        icon: us.skill.icon ?? undefined,
        createdAt: us.skill.createdAt,
      },
    }));
  }

  /**
   * Add skill to user profile
   */
  static async addUserSkill(userId: string, skillData: CreateUserSkillData): Promise<UserSkillData> {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillData.skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Check if user already has this skill
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId: skillData.skillId,
        },
      },
    });

    if (existingUserSkill) {
      // If user already has the skill, update proficiency/yearsOfExp instead of throwing
      const updated = await prisma.userSkill.update({
        where: {
          userId_skillId: {
            userId,
            skillId: skillData.skillId,
          },
        },
        data: {
          proficiency: skillData.proficiency,
          yearsOfExp: skillData.yearsOfExp,
        },
        include: { skill: true },
      });

      return {
        id: updated.id,
        userId: updated.userId,
        skillId: updated.skillId,
        proficiency: updated.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
        yearsOfExp: updated.yearsOfExp ?? undefined,
        endorsements: updated.endorsements,
        skill: {
          id: updated.skill.id,
          name: updated.skill.name,
          category: updated.skill.category,
          description: updated.skill.description ?? undefined,
          icon: updated.skill.icon ?? undefined,
          createdAt: updated.skill.createdAt,
        },
      };
    }

    // Create user skill
    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId: skillData.skillId,
        proficiency: skillData.proficiency,
        yearsOfExp: skillData.yearsOfExp,
      },
      include: {
        skill: true,
      },
    });

    return {
      id: userSkill.id,
      userId: userSkill.userId,
      skillId: userSkill.skillId,
      proficiency: userSkill.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      yearsOfExp: userSkill.yearsOfExp ?? undefined,
      endorsements: userSkill.endorsements,
      skill: {
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        category: userSkill.skill.category,
        description: userSkill.skill.description ?? undefined,
        icon: userSkill.skill.icon ?? undefined,
        createdAt: userSkill.skill.createdAt,
      },
    };
  }

  /**
   * Update user skill
   */
  static async updateUserSkill(
    userId: string,
    skillId: string,
    updateData: Partial<CreateUserSkillData>
  ): Promise<UserSkillData> {
    // Check if user skill exists
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    if (!existingUserSkill) {
      throw new Error('User skill not found');
    }

    // Update user skill
    const userSkill = await prisma.userSkill.update({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      data: updateData,
      include: {
        skill: true,
      },
    });

    return {
      id: userSkill.id,
      userId: userSkill.userId,
      skillId: userSkill.skillId,
      proficiency: userSkill.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      yearsOfExp: userSkill.yearsOfExp ?? undefined,
      endorsements: userSkill.endorsements,
      skill: {
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        category: userSkill.skill.category,
        description: userSkill.skill.description ?? undefined,
        icon: userSkill.skill.icon ?? undefined,
        createdAt: userSkill.skill.createdAt,
      },
    };
  }

  /**
   * Remove skill from user profile
   */
  static async removeUserSkill(userId: string, skillId: string): Promise<{ message: string }> {
    // Check if user skill exists
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    if (!existingUserSkill) {
      throw new Error('User skill not found');
    }

    // Delete user skill
    await prisma.userSkill.delete({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    return { message: 'Skill removed successfully' };
  }

  /**
   * Endorse user skill
   */
  static async endorseUserSkill(userId: string, skillId: string): Promise<{ message: string }> {
    // Check if user skill exists
    const userSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
    });

    if (!userSkill) {
      throw new Error('User skill not found');
    }

    // Increment endorsements
    await prisma.userSkill.update({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      data: {
        endorsements: {
          increment: 1,
        },
      },
    });

    return { message: 'Skill endorsed successfully' };
  }

  /**
   * Get users with specific skill
   */
  static async getUsersWithSkill(
    skillId: string,
    params: UserSearchParams
  ): Promise<PaginatedResponse<UserProfile>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Check if skill exists
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get users with this skill
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          isVerified: true,
          userSkills: {
            some: {
              skillId,
            },
          },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          department: true,
          year: true,
          semester: true,
          bio: true,
          avatar: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.user.count({
        where: {
          isVerified: true,
          userSkills: {
            some: {
              skillId,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users as UserProfile[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<{
    totalSkills: number;
    totalProjects: number;
    totalResources: number;
    totalPosts: number;
    totalEndorsements: number;
  }> {
    const [
      totalSkills,
      totalProjects,
      totalResources,
      totalPosts,
      totalEndorsements,
    ] = await Promise.all([
      prisma.userSkill.count({
        where: { userId },
      }),
      prisma.projectMember.count({
        where: { userId },
      }),
      prisma.resource.count({
        where: { uploaderId: userId },
      }),
      prisma.post.count({
        where: { authorId: userId },
      }),
      prisma.userSkill.aggregate({
        where: { userId },
        _sum: { endorsements: true },
      }),
    ]);

    return {
      totalSkills,
      totalProjects,
      totalResources,
      totalPosts,
      totalEndorsements: totalEndorsements._sum.endorsements || 0,
    };
  }
}
