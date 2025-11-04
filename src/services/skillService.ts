import prisma from '../config/database';
import { SkillData, CreateUserSkillData, UserSkillData, PaginatedResponse } from '../types';

export class SkillService {
  static async getAllSkills(): Promise<SkillData[]> {
    const skills = await prisma.skills.findMany({
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
      created_at: skill.created_at,
    }));
  }

  static async getSkillsByCategory(category: string): Promise<SkillData[]> {
    const skills = await prisma.skills.findMany({
      where: {
        category: { contains: category, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
    });

    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      created_at: skill.created_at,
    }));
  }

  static async getSkillById(skillId: string): Promise<SkillData> {
    const skill = await prisma.skills.findUnique({ where: { id: skillId } });
    if (!skill) throw new Error('Skill not found');

    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      created_at: skill.created_at,
    };
  }

  static async createSkill(skillData: {
    name: string;
    category: string;
    description?: string;
    icon?: string;
  }): Promise<SkillData> {
    const existingSkill = await prisma.skills.findUnique({ where: { name: skillData.name } });
    if (existingSkill) throw new Error('Skill with this name already exists');

    const skill = await prisma.skills.create({ data: skillData });
    return {
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      created_at: skill.created_at,
    };
  }

  static async updateSkill(
    skillId: string,
    updateData: { name?: string; category?: string; description?: string; icon?: string }
  ): Promise<SkillData> {
    const skill = await prisma.skills.findUnique({ where: { id: skillId } });
    if (!skill) throw new Error('Skill not found');

    if (updateData.name && updateData.name !== skill.name) {
      const existingSkill = await prisma.skills.findUnique({ where: { name: updateData.name } });
      if (existingSkill) throw new Error('Skill with this name already exists');
    }

    const updatedSkill = await prisma.skills.update({ where: { id: skillId }, data: updateData });
    return {
      id: updatedSkill.id,
      name: updatedSkill.name,
      category: updatedSkill.category,
      description: updatedSkill.description ?? undefined,
      icon: updatedSkill.icon ?? undefined,
      created_at: updatedSkill.created_at,
    };
  }

  static async deleteSkill(skillId: string): Promise<{ message: string }> {
    const skill = await prisma.skills.findUnique({ where: { id: skillId } });
    if (!skill) throw new Error('Skill not found');

    const userSkillsCount = await prisma.user_skills.count({ where: { skill_id: skillId } });
    if (userSkillsCount > 0) throw new Error('Cannot delete skill being used by users');

    const projectSkillsCount = await prisma.project_skills.count({ where: { skill_id: skillId } });
    if (projectSkillsCount > 0) throw new Error('Cannot delete skill being used by projects');

    await prisma.skills.delete({ where: { id: skillId } });
    return { message: 'Skill deleted successfully' };
  }

  static async searchSkills(searchTerm: string, category?: string): Promise<SkillData[]> {
    const where: any = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };
    if (category) where.category = { contains: category, mode: 'insensitive' };

    const skills = await prisma.skills.findMany({
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
      created_at: skill.created_at,
    }));
  }

  static async getSkillCategories(): Promise<string[]> {
    const categories = await prisma.skills.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map(cat => cat.category);
  }

  static async getPopularSkills(limit: number = 10): Promise<SkillData[]> {
    const skills = await prisma.skills.findMany({
      include: { user_skills: true },
      orderBy: { user_skills: { _count: 'desc' } },
      take: limit,
    });

    return skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description ?? undefined,
      icon: skill.icon ?? undefined,
      created_at: skill.created_at,
    }));
  }

  static async getSkillStats(skillId: string): Promise<{
    totalUsers: number;
    averageProficiency: string;
    totalEndorsements: number;
  }> {
    const [userSkills, totalUsers, totalEndorsements] = await Promise.all([
      prisma.user_skills.findMany({ where: { skill_id: skillId }, select: { proficiency: true } }),
      prisma.user_skills.count({ where: { skill_id: skillId } }),
      prisma.user_skills.aggregate({ where: { skill_id: skillId }, _sum: { endorsements: true } }),
    ]);

    const proficiencyValues = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
    const totalProficiency = userSkills.reduce(
      (sum, us) => sum + (proficiencyValues[us.proficiency as keyof typeof proficiencyValues] || 0),
      0
    );

    const averageProficiencyValue = totalUsers > 0 ? totalProficiency / totalUsers : 0;
    let averageProficiency = 'BEGINNER';
    if (averageProficiencyValue >= 3.5) averageProficiency = 'EXPERT';
    else if (averageProficiencyValue >= 2.5) averageProficiency = 'ADVANCED';
    else if (averageProficiencyValue >= 1.5) averageProficiency = 'INTERMEDIATE';

    return {
      totalUsers,
      averageProficiency,
      totalEndorsements: totalEndorsements._sum.endorsements || 0,
    };
  }

  static async getSkillLeaderboard(skillId: string, limit: number = 10): Promise<
    Array<{
      user: { id: string; first_name: string; last_name: string; avatar?: string };
      proficiency: string;
      endorsements: number;
    }>
  > {
    const userSkills = await prisma.user_skills.findMany({
      where: { skill_id: skillId },
      include: { user: { select: { id: true, first_name: true, last_name: true, avatar: true } } },
      orderBy: [
        { endorsements: 'desc' },
        { proficiency: 'desc' },
      ],
      take: limit,
    });

    return userSkills.map(us => ({
      user: {
        id: us.user.id,
        first_name: us.user.first_name,
        last_name: us.user.last_name,
        avatar: us.user.avatar ?? undefined,
      },
      proficiency: us.proficiency,
      endorsements: us.endorsements,
    }));
  }
}
