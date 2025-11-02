import prisma from '../config/database';
import { SkillData, CreateUserSkillData, UserSkillData, PaginatedResponse } from '../types';

export class SkillService {
  /**
   * Get all skills with categories
   */
  static async getAllSkills(): Promise<SkillData[]> {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      createdAt: skill.createdAt,
    }));
  }

  /**
   * Get skills by category
   */
  static async getSkillsByCategory(category: string): Promise<SkillData[]> {
    const skills = await prisma.skill.findMany({
      where: {
        category: {
          contains: category,
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });

    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      createdAt: skill.createdAt,
    }));
  }

  /**
   * Get skill by ID
   */
  static async getSkillById(skillId: string): Promise<SkillData> {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      createdAt: skill.createdAt,
    };
  }

  /**
   * Create new skill
   */
  static async createSkill(skillData: {
    name: string;
    category: string;
    description?: string;
    icon?: string;
  }): Promise<SkillData> {
    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name: skillData.name },
    });

    if (existingSkill) {
      throw new Error('Skill with this name already exists');
    }

    const skill = await prisma.skill.create({
      data: skillData,
    });

    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      createdAt: skill.createdAt,
    };
  }

  /**
   * Update skill
   */
  static async updateSkill(
    skillId: string,
    updateData: {
      name?: string;
      category?: string;
      description?: string;
      icon?: string;
    }
  ): Promise<SkillData> {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Check if new name conflicts with existing skill
    if (updateData.name && updateData.name !== skill.name) {
      const existingSkill = await prisma.skill.findUnique({
        where: { name: updateData.name },
      });

      if (existingSkill) {
        throw new Error('Skill with this name already exists');
      }
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: updateData,
    });

    return {
      id: updatedSkill.id,
      name: updatedSkill.name,
      category: updatedSkill.category,
      description: updatedSkill.description ?? undefined,
      icon: updatedSkill.icon ?? undefined,
      createdAt: updatedSkill.createdAt,
    };
  }

  /**
   * Delete skill
   */
  static async deleteSkill(skillId: string): Promise<{ message: string }> {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Check if skill is being used by any users
    const userSkillsCount = await prisma.userSkill.count({
      where: { skillId },
    });

    if (userSkillsCount > 0) {
      throw new Error('Cannot delete skill that is being used by users');
    }

    // Check if skill is being used by any projects
    const projectSkillsCount = await prisma.projectSkill.count({
      where: { skillId },
    });

    if (projectSkillsCount > 0) {
      throw new Error('Cannot delete skill that is being used by projects');
    }

    await prisma.skill.delete({
      where: { id: skillId },
    });

    return { message: 'Skill deleted successfully' };
  }

  /**
   * Search skills
   */
  static async searchSkills(
    searchTerm: string,
    category?: string
  ): Promise<SkillData[]> {
    const where: any = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };

    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive',
      };
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      createdAt: skill.createdAt,
    }));
  }

  /**
   * Get skill categories
   */
  static async getSkillCategories(): Promise<string[]> {
    const categories = await prisma.skill.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map(cat => cat.category);
  }

  /**
   * Get popular skills
   */
  static async getPopularSkills(limit: number = 10): Promise<SkillData[]> {
    const skills = await prisma.skill.findMany({
      include: {
        userSkills: true,
      },
      orderBy: {
        userSkills: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      createdAt: skill.createdAt,
    }));
  }

  /**
   * Get skill statistics
   */
  static async getSkillStats(skillId: string): Promise<{
    totalUsers: number;
    averageProficiency: string;
    totalEndorsements: number;
  }> {
    const [userSkills, totalUsers, totalEndorsements] = await Promise.all([
      prisma.userSkill.findMany({
        where: { skillId },
        select: { proficiency: true },
      }),
      prisma.userSkill.count({
        where: { skillId },
      }),
      prisma.userSkill.aggregate({
        where: { skillId },
        _sum: { endorsements: true },
      }),
    ]);

    // Calculate average proficiency
    const proficiencyValues = {
      BEGINNER: 1,
      INTERMEDIATE: 2,
      ADVANCED: 3,
      EXPERT: 4,
    };

    const totalProficiency = userSkills.reduce((sum, us) => {
      return sum + (proficiencyValues[us.proficiency as keyof typeof proficiencyValues] || 0);
    }, 0);

    const averageProficiencyValue = totalUsers > 0 ? totalProficiency / totalUsers : 0;
    
    let averageProficiency = 'BEGINNER';
    if (averageProficiencyValue >= 3.5) {
      averageProficiency = 'EXPERT';
    } else if (averageProficiencyValue >= 2.5) {
      averageProficiency = 'ADVANCED';
    } else if (averageProficiencyValue >= 1.5) {
      averageProficiency = 'INTERMEDIATE';
    }

    return {
      totalUsers,
      averageProficiency,
      totalEndorsements: totalEndorsements._sum.endorsements || 0,
    };
  }

  /**
   * Get skill leaderboard
   */
  static async getSkillLeaderboard(
    skillId: string,
    limit: number = 10
  ): Promise<Array<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    proficiency: string;
    endorsements: number;
  }>> {
    const userSkills = await prisma.userSkill.findMany({
      where: { skillId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { endorsements: 'desc' },
        { proficiency: 'desc' },
      ],
      take: limit,
    });

    return userSkills.map(us => ({
      user: {
        id: us.user.id,
        firstName: us.user.firstName,
        lastName: us.user.lastName,
        avatar: us.user.avatar ?? undefined,
      },
      proficiency: us.proficiency,
      endorsements: us.endorsements,
    }));
  }
}
