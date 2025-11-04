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
      is_verified: true,
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
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { roll_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (skills.length > 0) {
      where.user_skills = {
        some: {
          skill_id: { in: skills },
        },
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    const sortByMap: any = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      firstName: 'first_name',
      lastName: 'last_name',
    };
    orderBy[sortByMap[sortBy] || sortBy] = sortOrder;

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          roll_number: true,
          department: true,
          year: true,
          semester: true,
          bio: true,
          avatar: true,
          is_verified: true,
          created_at: true,
          updated_at: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        rollNumber: user.roll_number ?? undefined,
        department: user.department ?? undefined,
        year: user.year ?? undefined,
        semester: user.semester ?? undefined,
        bio: user.bio ?? undefined,
        avatar: user.avatar ?? undefined,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
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
        first_name: true,
        last_name: true,
        roll_number: true,
        department: true,
        year: true,
        semester: true,
        bio: true,
        avatar: true,
        is_verified: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      rollNumber: user.roll_number ?? undefined,
      department: user.department ?? undefined,
      year: user.year ?? undefined,
      semester: user.semester ?? undefined,
      bio: user.bio ?? undefined,
      avatar: user.avatar ?? undefined,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  /**
   * Get user skills
   */
  static async getUserSkills(userId: string): Promise<UserSkillData[]> {
    const userSkills = await prisma.user_skill.findMany({
      where: { user_id: userId },
      include: {
        skill: true,
      },
      orderBy: { endorsements: 'desc' },
    });

    return userSkills.map(us => ({
      id: us.id,
      userId: us.user_id,
      skillId: us.skill_id,
      proficiency: us.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      yearsOfExp: us.years_of_exp ?? undefined,
      endorsements: us.endorsements,
      skill: {
        id: us.skill.id,
        name: us.skill.name,
        category: us.skill.category,
        description: us.skill.description ?? undefined,
        icon: us.skill.icon ?? undefined,
        createdAt: us.skill.created_at,
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
    const existingUserSkill = await prisma.user_skill.findUnique({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillData.skillId,
        },
      },
    });

    if (existingUserSkill) {
      throw new Error('User already has this skill');
    }

    // Create user skill
    const userSkill = await prisma.user_skill.create({
      data: {
        user_id: userId,
        skill_id: skillData.skillId,
        proficiency: skillData.proficiency,
        years_of_exp: skillData.yearsOfExp,
      },
      include: {
        skill: true,
      },
    });

    return {
      id: userSkill.id,
      userId: userSkill.user_id,
      skillId: userSkill.skill_id,
      proficiency: userSkill.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      yearsOfExp: userSkill.years_of_exp ?? undefined,
      endorsements: userSkill.endorsements,
      skill: {
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        category: userSkill.skill.category,
        description: userSkill.skill.description ?? undefined,
        icon: userSkill.skill.icon ?? undefined,
        createdAt: userSkill.skill.created_at,
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
    const existingUserSkill = await prisma.user_skill.findUnique({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillId,
        },
      },
    });

    if (!existingUserSkill) {
      throw new Error('User skill not found');
    }

    // Update user skill
    const userSkill = await prisma.user_skill.update({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillId,
        },
      },
      data: updateData,
      include: {
        skill: true,
      },
    });

    return {
      id: userSkill.id,
      userId: userSkill.user_id,
      skillId: userSkill.skill_id,
      proficiency: userSkill.proficiency as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      yearsOfExp: userSkill.years_of_exp ?? undefined,
      endorsements: userSkill.endorsements,
      skill: {
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        category: userSkill.skill.category,
        description: userSkill.skill.description ?? undefined,
        icon: userSkill.skill.icon ?? undefined,
        createdAt: userSkill.skill.created_at,
      },
    };
  }

  /**
   * Remove skill from user profile
   */
  static async removeUserSkill(userId: string, skillId: string): Promise<{ message: string }> {
    // Check if user skill exists
    const existingUserSkill = await prisma.user_skill.findUnique({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillId,
        },
      },
    });

    if (!existingUserSkill) {
      throw new Error('User skill not found');
    }

    // Delete user skill
    await prisma.user_skill.delete({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillId,
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
    const userSkill = await prisma.user_skill.findUnique({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillId,
        },
      },
    });

    if (!userSkill) {
      throw new Error('User skill not found');
    }

    // Increment endorsements
    await prisma.user_skill.update({
      where: {
        user_id_skill_id: {
          user_id: userId,
          skill_id: skillId,
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
    const sortByMap: any = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      firstName: 'first_name',
      lastName: 'last_name',
    };
    orderBy[sortByMap[sortBy] || sortBy] = sortOrder;

    // Get users with this skill
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          is_verified: true,
          user_skills: {
            some: {
              skill_id: skillId,
            },
          },
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          roll_number: true,
          department: true,
          year: true,
          semester: true,
          bio: true,
          avatar: true,
          is_verified: true,
          created_at: true,
          updated_at: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.user.count({
        where: {
          is_verified: true,
          user_skills: {
            some: {
              skill_id: skillId,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        rollNumber: user.roll_number ?? undefined,
        department: user.department ?? undefined,
        year: user.year ?? undefined,
        semester: user.semester ?? undefined,
        bio: user.bio ?? undefined,
        avatar: user.avatar ?? undefined,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      })),
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
      prisma.user_skill.count({
        where: { user_id: userId },
      }),
      prisma.project_member.count({
        where: { user_id: userId },
      }),
      prisma.resource.count({
        where: { uploader_id: userId },
      }),
      prisma.post.count({
        where: { author_id: userId },
      }),
      prisma.user_skill.aggregate({
        where: { user_id: userId },
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