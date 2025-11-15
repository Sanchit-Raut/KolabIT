import prisma from '../config/database';
import {
  ProjectData,
  CreateProjectData,
  UpdateProjectData,
  ProjectSearchParams,
  JoinRequestData,
  CreateJoinRequestData,
  TaskData,
  CreateTaskData,
  UpdateTaskData,
  PaginatedResponse,
} from '../types';

export class ProjectService {
  /**
   * Get projects by user ID
   */
  static async getProjectsByUser(userId: string) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        },
        requiredSkills: {
          include: {
            skill: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          }
        }
      }
    });

    return projects;
  }
  /**
   * Create new project
   */
  static async createProject(
    ownerId: string,
    projectData: CreateProjectData
  ): Promise<ProjectData> {
    // Check if owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      throw new Error('Owner not found');
    }

    // Validate required skills exist
    if (projectData.requiredSkills.length > 0) {
      const skills = await prisma.skill.findMany({
        where: { id: { in: projectData.requiredSkills } },
      });

      if (skills.length !== projectData.requiredSkills.length) {
        throw new Error('One or more required skills not found');
      }
    }

    // Create project with required skills
    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        status: 'RECRUITING',
        description: projectData.description,
        type: projectData.type,
        maxMembers: projectData.maxMembers,
  startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
  endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
        githubUrl: projectData.githubUrl,
        liveUrl: projectData.liveUrl,
        ownerId,
        requiredSkills: {
          create: projectData.requiredSkills.map(skillId => ({
            skillId,
            required: true,
          })),
        },
      },
      include: {
        owner: {
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
        },
        members: {
          include: {
            user: {
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
            },
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        tasks: true,
      },
    });

    // Add owner as project member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: ownerId,
        role: 'MAINTAINER',
      },
    });

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status as 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
      type: project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
  maxMembers: project.maxMembers ?? undefined,
  startDate: project.startDate ?? undefined,
  endDate: project.endDate ?? undefined,
  githubUrl: project.githubUrl ?? undefined,
  liveUrl: project.liveUrl ?? undefined,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
  owner: (project as any).owner as any,
  members: (project as any).members.map((member: any) => ({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
        joinedAt: member.joinedAt,
        user: member.user as any,
      })),
  requiredSkills: (project as any).requiredSkills.map((ps: any) => ({
        id: ps.id,
        projectId: ps.projectId,
        skillId: ps.skillId,
        required: ps.required,
        skill: {
          id: ps.skill.id,
          name: ps.skill.name,
          category: ps.skill.category,
          description: ps.skill.description ?? undefined,
          icon: ps.skill.icon ?? undefined,
          createdAt: ps.skill.createdAt,
        },
      })),
  tasks: (project as any).tasks.map((task: any) => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
  description: task.description ?? undefined,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  assigneeId: task.assigneeId ?? undefined,
  dueDate: task.dueDate ?? undefined,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    };
  }

  /**
   * Get projects with filters
   */
  static async getProjects(params: ProjectSearchParams): Promise<PaginatedResponse<ProjectData>> {
    const {
      page = 1,
      limit = 20,
      skills = [],
      status,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (skills.length > 0) {
      where.requiredSkills = {
        some: {
          skillId: { in: skills },
        },
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Get projects and total count
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
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
          },
          members: {
            include: {
              user: {
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
              },
            },
          },
          requiredSkills: {
            include: {
              skill: true,
            },
          },
          tasks: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: projects.map(project => ({
        id: project.id,
        title: project.title,
  description: project.description ?? undefined,
        status: project.status as 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
        type: project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
  maxMembers: project.maxMembers ?? undefined,
  startDate: project.startDate ?? undefined,
  endDate: project.endDate ?? undefined,
  githubUrl: project.githubUrl ?? undefined,
  liveUrl: project.liveUrl ?? undefined,
        ownerId: project.ownerId,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        owner: project.owner as any,
        members: project.members.map(member => ({
          id: member.id,
          projectId: member.projectId,
          userId: member.userId,
          role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
          joinedAt: member.joinedAt,
          user: member.user as any,
        })),
  requiredSkills: (project as any).requiredSkills.map((ps: any) => ({
          id: ps.id,
          projectId: ps.projectId,
          skillId: ps.skillId,
          required: ps.required,
          skill: {
            id: ps.skill.id,
            name: ps.skill.name,
            category: ps.skill.category,
            description: ps.skill.description ?? undefined,
            icon: ps.skill.icon ?? undefined,
            createdAt: ps.skill.createdAt,
          },
        })),
  tasks: (project as any).tasks.map((task: any) => ({
          id: task.id,
          projectId: task.projectId,
          title: task.title,
          description: task.description ?? undefined,
          status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          assigneeId: task.assigneeId ?? undefined,
          dueDate: task.dueDate ?? undefined,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
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
   * Get project by ID
   */
  static async getProjectById(projectId: string): Promise<ProjectData> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
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
        },
        members: {
          include: {
            user: {
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
            },
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        tasks: {
          include: {
            assignee: {
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
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      id: project.id,
      title: project.title,
  description: project.description ?? undefined,
      status: project.status as 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
      type: project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
  maxMembers: project.maxMembers ?? undefined,
  startDate: project.startDate ?? undefined,
  endDate: project.endDate ?? undefined,
  githubUrl: project.githubUrl ?? undefined,
  liveUrl: project.liveUrl ?? undefined,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      owner: project.owner as any,
      members: project.members.map(member => ({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
        joinedAt: member.joinedAt,
        user: member.user as any,
      })),
  requiredSkills: (project as any).requiredSkills.map((ps: any) => ({
        id: ps.id,
        projectId: ps.projectId,
        skillId: ps.skillId,
        required: ps.required,
        skill: {
          id: ps.skill.id,
          name: ps.skill.name,
          category: ps.skill.category,
          description: ps.skill.description,
          icon: ps.skill.icon,
          createdAt: ps.skill.createdAt,
        },
      })),
  tasks: (project as any).tasks.map((task: any) => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        assignee: task.assignee as any,
      })),
    };
  }

  /**
   * Update project
   */
  static async updateProject(
    projectId: string,
    userId: string,
    updateData: UpdateProjectData
  ): Promise<ProjectData> {
    // Check if project exists and user is owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new Error('Only project owner can update the project');
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        owner: {
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
        },
        members: {
          include: {
            user: {
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
            },
          },
        },
        requiredSkills: {
          include: {
            skill: true,
          },
        },
        tasks: true,
      },
    });

    return {
      id: updatedProject.id,
      title: updatedProject.title,
      description: updatedProject.description,
      status: updatedProject.status as 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
      type: updatedProject.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
  maxMembers: updatedProject.maxMembers ?? undefined,
  startDate: updatedProject.startDate ?? undefined,
  endDate: updatedProject.endDate ?? undefined,
  githubUrl: updatedProject.githubUrl ?? undefined,
  liveUrl: updatedProject.liveUrl ?? undefined,
      ownerId: updatedProject.ownerId,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
      owner: updatedProject.owner as any,
      members: updatedProject.members.map(member => ({
        id: member.id,
        projectId: member.projectId,
        userId: member.userId,
        role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
        joinedAt: member.joinedAt,
        user: member.user as any,
      })),
  requiredSkills: (updatedProject as any).requiredSkills.map((ps: any) => ({
        id: ps.id,
        projectId: ps.projectId,
        skillId: ps.skillId,
        required: ps.required,
        skill: {
          id: ps.skill.id,
          name: ps.skill.name,
          category: ps.skill.category,
          description: ps.skill.description ?? undefined,
          icon: ps.skill.icon ?? undefined,
          createdAt: ps.skill.createdAt,
        },
      })),
  tasks: (updatedProject as any).tasks.map((task: any) => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        assigneeId: task.assigneeId ?? undefined,
        dueDate: task.dueDate ?? undefined,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    };
  }

  /**
   * Delete project
   */
  static async deleteProject(projectId: string, userId: string): Promise<{ message: string }> {
    // Check if project exists and user is owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new Error('Only project owner can delete the project');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }

  /**
   * Request to join project
   */
  static async requestToJoinProject(
    projectId: string,
    userId: string,
    requestData: CreateJoinRequestData
  ): Promise<JoinRequestData> {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of this project');
    }

    // Check if user is the owner
    if (project.ownerId === userId) {
      throw new Error('Project owner cannot request to join their own project');
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (existingRequest) {
      if (existingRequest.status === 'PENDING') {
        throw new Error('Join request already pending');
      }
      if (existingRequest.status === 'ACCEPTED') {
        throw new Error('Join request already accepted');
      }
    }

    // Create or update join request
    const joinRequest = await prisma.joinRequest.upsert({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      update: {
        message: requestData.message,
        status: 'PENDING',
        updatedAt: new Date(),
      },
      create: {
        projectId,
        userId,
        message: requestData.message,
        status: 'PENDING',
      },
      include: {
        user: {
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
        },
        project: {
          include: {
            owner: {
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
            },
            members: {
              include: {
                user: {
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
                },
              },
            },
            requiredSkills: {
              include: {
                skill: true,
              },
            },
            tasks: true,
          },
        },
      },
    });

    return {
      id: joinRequest.id,
      projectId: joinRequest.projectId,
      userId: joinRequest.userId,
      message: joinRequest.message ?? undefined,
      status: joinRequest.status as 'PENDING' | 'ACCEPTED' | 'REJECTED',
      createdAt: joinRequest.createdAt,
      updatedAt: joinRequest.updatedAt,
      user: joinRequest.user as any,
      project: {
  id: joinRequest.project.id,
  title: joinRequest.project.title ?? undefined,
  description: joinRequest.project.description ?? undefined,
        status: joinRequest.project.status as 'RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
        type: joinRequest.project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
  maxMembers: joinRequest.project.maxMembers ?? undefined,
  startDate: joinRequest.project.startDate ?? undefined,
  endDate: joinRequest.project.endDate ?? undefined,
  githubUrl: joinRequest.project.githubUrl ?? undefined,
  liveUrl: joinRequest.project.liveUrl ?? undefined,
        ownerId: joinRequest.project.ownerId,
        createdAt: joinRequest.project.createdAt,
        updatedAt: joinRequest.project.updatedAt,
        owner: joinRequest.project.owner as any,
        members: joinRequest.project.members.map(member => ({
          id: member.id,
          projectId: member.projectId,
          userId: member.userId,
          role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
          joinedAt: member.joinedAt,
          user: member.user as any,
        })),
  requiredSkills: (joinRequest.project as any).requiredSkills.map((ps: any) => ({
          id: ps.id,
          projectId: ps.projectId,
          skillId: ps.skillId,
          required: ps.required,
          skill: {
            id: ps.skill.id,
            name: ps.skill.name,
            category: ps.skill.category,
            description: ps.skill.description,
            icon: ps.skill.icon,
            createdAt: ps.skill.createdAt,
          },
        })),
  tasks: (joinRequest.project as any).tasks.map((task: any) => ({
          id: task.id,
          projectId: task.projectId,
          title: task.title,
          description: task.description,
          status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          assigneeId: task.assigneeId,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
      },
    };
  }

  /**
   * Update join request (accept/reject)
   */
  static async updateJoinRequest(
    projectId: string,
    requestId: string,
    userId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ): Promise<{ message: string }> {
    // Check if project exists and user is owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.ownerId !== userId) {
      throw new Error('Only project owner can accept/reject join requests');
    }

    // Check if join request exists
    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
    });

    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    if (joinRequest.projectId !== projectId) {
      throw new Error('Join request does not belong to this project');
    }

    if (joinRequest.status !== 'PENDING') {
      throw new Error('Join request has already been processed');
    }

    // Update join request status
    await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // If accepted, add user to project members
    if (status === 'ACCEPTED') {
      // Check if project has reached max members
      if (project.maxMembers) {
        const memberCount = await prisma.projectMember.count({
          where: { projectId },
        });

        if (memberCount >= project.maxMembers) {
          throw new Error('Project has reached maximum number of members');
        }
      }

      await prisma.projectMember.create({
        data: {
          projectId,
          userId: joinRequest.userId,
          role: 'MEMBER',
        },
      });
    }

    return { message: `Join request ${status.toLowerCase()} successfully` };
  }

  /**
   * Get project members
   */
  static async getProjectMembers(projectId: string): Promise<Array<{
    id: string;
    projectId: string;
    userId: string;
    role: 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER';
    joinedAt: Date;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      rollNumber?: string;
      department?: string;
      year?: number;
      semester?: number;
      bio?: string;
      avatar?: string;
      isVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }>> {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
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
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map(member => ({
      id: member.id,
      projectId: member.projectId,
      userId: member.userId,
      role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
      joinedAt: member.joinedAt,
      user: member.user as any,
    }));
  }

  /**
   * Create project task
   */
  static async createTask(
    projectId: string,
    userId: string,
    taskData: CreateTaskData
  ): Promise<TaskData> {
    // Check if project exists and user is a member
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Check if user is a member or owner
    const isOwner = project.ownerId === userId;
    const isMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!isOwner && !isMember) {
      throw new Error('Only project members can create tasks');
    }

    // Validate assignee if provided
    if (taskData.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: taskData.assigneeId },
      });

      if (!assignee) {
        throw new Error('Assignee not found');
      }

      // Check if assignee is a project member
      const assigneeMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: taskData.assigneeId,
          },
        },
      });

      if (!assigneeMember && project.ownerId !== taskData.assigneeId) {
        throw new Error('Assignee must be a project member');
      }
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: taskData.title,
        description: taskData.description,
        status: 'TODO',
        priority: taskData.priority,
            assigneeId: taskData.assigneeId ?? undefined,
            dueDate: taskData.dueDate ?? undefined,
      },
      include: {
        assignee: {
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
        },
      },
    });

    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
  description: task.description ?? undefined,
      status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
      priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          assigneeId: task.assigneeId ?? undefined,
  dueDate: task.dueDate ?? undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      assignee: task.assignee as any,
    };
  }

  /**
   * Update project task
   */
  static async updateTask(
    projectId: string,
    taskId: string,
    userId: string,
    updateData: UpdateTaskData
  ): Promise<TaskData> {
    // Check if task exists and belongs to project
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    if (task.projectId !== projectId) {
      throw new Error('Task does not belong to this project');
    }

    // Check if user is a member or owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const isOwner = project.ownerId === userId;
    const isMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!isOwner && !isMember) {
      throw new Error('Only project members can update tasks');
    }

    // Validate assignee if provided
    if (updateData.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: updateData.assigneeId },
      });

      if (!assignee) {
        throw new Error('Assignee not found');
      }

      // Check if assignee is a project member
      const assigneeMember = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: updateData.assigneeId,
          },
        },
      });

      if (!assigneeMember && project.ownerId !== updateData.assigneeId) {
        throw new Error('Assignee must be a project member');
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            rollNumber: true,
            department: true,
            year: true,
            semester: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      id: updatedTask.id,
      projectId: updatedTask.projectId,
      title: updatedTask.title,
      description: updatedTask.description ?? undefined,
      status: updatedTask.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
      priority: updatedTask.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          assigneeId: updatedTask.assigneeId ?? undefined,
      dueDate: updatedTask.dueDate ?? undefined,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
      assignee: (updatedTask as any).assignee as any,
    };
  }
}
