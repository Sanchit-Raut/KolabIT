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
        status: 'PLANNING',
        description: projectData.description,
        type: projectData.type,
        max_members: projectData.maxMembers,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        github_url: projectData.githubUrl,
        live_url: projectData.liveUrl,
        owner_id: ownerId,
        required_skills: {
          create: projectData.requiredSkills.map(skillId => ({
            skill_id: skillId,
            required: true,
          })),
        },
      },
      include: {
        owner: {
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
        },
        members: {
          include: {
            user: {
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
            },
          },
        },
        required_skills: {
          include: {
            skill: true,
          },
        },
        tasks: true,
      },
    });

    // Add owner as project member
    await prisma.project_member.create({
      data: {
        project_id: project.id,
        user_id: ownerId,
        role: 'MAINTAINER',
      },
    });

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status as 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
      type: project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
      maxMembers: project.max_members ?? undefined,
      startDate: project.start_date ?? undefined,
      endDate: project.end_date ?? undefined,
      githubUrl: project.github_url ?? undefined,
      liveUrl: project.live_url ?? undefined,
      ownerId: project.owner_id,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      owner: (project as any).owner as any,
      members: (project as any).members.map((member: any) => ({
        id: member.id,
        projectId: member.project_id,
        userId: member.user_id,
        role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
        joinedAt: member.joined_at,
        user: member.user as any,
      })),
      requiredSkills: (project as any).required_skills.map((ps: any) => ({
        id: ps.id,
        projectId: ps.project_id,
        skillId: ps.skill_id,
        required: ps.required,
        skill: {
          id: ps.skill.id,
          name: ps.skill.name,
          category: ps.skill.category,
          description: ps.skill.description ?? undefined,
          icon: ps.skill.icon ?? undefined,
          createdAt: ps.skill.created_at,
        },
      })),
      tasks: (project as any).tasks.map((task: any) => ({
        id: task.id,
        projectId: task.project_id,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        assigneeId: task.assignee_id ?? undefined,
        dueDate: task.due_date ?? undefined,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
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
      where.required_skills = {
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
      startDate: 'start_date',
      endDate: 'end_date',
    };
    orderBy[sortByMap[sortBy] || sortBy] = sortOrder;

    // Get projects and total count
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
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
          },
          members: {
            include: {
              user: {
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
              },
            },
          },
          required_skills: {
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
        status: project.status as 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
        type: project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
        maxMembers: project.max_members ?? undefined,
        startDate: project.start_date ?? undefined,
        endDate: project.end_date ?? undefined,
        githubUrl: project.github_url ?? undefined,
        liveUrl: project.live_url ?? undefined,
        ownerId: project.owner_id,
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        owner: project.owner as any,
        members: project.members.map(member => ({
          id: member.id,
          projectId: member.project_id,
          userId: member.user_id,
          role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
          joinedAt: member.joined_at,
          user: member.user as any,
        })),
        requiredSkills: (project as any).required_skills.map((ps: any) => ({
          id: ps.id,
          projectId: ps.project_id,
          skillId: ps.skill_id,
          required: ps.required,
          skill: {
            id: ps.skill.id,
            name: ps.skill.name,
            category: ps.skill.category,
            description: ps.skill.description ?? undefined,
            icon: ps.skill.icon ?? undefined,
            createdAt: ps.skill.created_at,
          },
        })),
        tasks: (project as any).tasks.map((task: any) => ({
          id: task.id,
          projectId: task.project_id,
          title: task.title,
          description: task.description ?? undefined,
          status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          assigneeId: task.assignee_id ?? undefined,
          dueDate: task.due_date ?? undefined,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
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
        },
        members: {
          include: {
            user: {
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
            },
          },
        },
        required_skills: {
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
      status: project.status as 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
      type: project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
      maxMembers: project.max_members ?? undefined,
      startDate: project.start_date ?? undefined,
      endDate: project.end_date ?? undefined,
      githubUrl: project.github_url ?? undefined,
      liveUrl: project.live_url ?? undefined,
      ownerId: project.owner_id,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      owner: project.owner as any,
      members: project.members.map(member => ({
        id: member.id,
        projectId: member.project_id,
        userId: member.user_id,
        role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
        joinedAt: member.joined_at,
        user: member.user as any,
      })),
      requiredSkills: (project as any).required_skills.map((ps: any) => ({
        id: ps.id,
        projectId: ps.project_id,
        skillId: ps.skill_id,
        required: ps.required,
        skill: {
          id: ps.skill.id,
          name: ps.skill.name,
          category: ps.skill.category,
          description: ps.skill.description,
          icon: ps.skill.icon,
          createdAt: ps.skill.created_at,
        },
      })),
      tasks: (project as any).tasks.map((task: any) => ({
        id: task.id,
        projectId: task.project_id,
        title: task.title,
        description: task.description,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        assigneeId: task.assignee_id,
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
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

    if (project.owner_id !== userId) {
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
        },
        members: {
          include: {
            user: {
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
            },
          },
        },
        required_skills: {
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
      status: updatedProject.status as 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
      type: updatedProject.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
      maxMembers: updatedProject.max_members ?? undefined,
      startDate: updatedProject.start_date ?? undefined,
      endDate: updatedProject.end_date ?? undefined,
      githubUrl: updatedProject.github_url ?? undefined,
      liveUrl: updatedProject.live_url ?? undefined,
      ownerId: updatedProject.owner_id,
      createdAt: updatedProject.created_at,
      updatedAt: updatedProject.updated_at,
      owner: updatedProject.owner as any,
      members: updatedProject.members.map(member => ({
        id: member.id,
        projectId: member.project_id,
        userId: member.user_id,
        role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
        joinedAt: member.joined_at,
        user: member.user as any,
      })),
      requiredSkills: (updatedProject as any).required_skills.map((ps: any) => ({
        id: ps.id,
        projectId: ps.project_id,
        skillId: ps.skill_id,
        required: ps.required,
        skill: {
          id: ps.skill.id,
          name: ps.skill.name,
          category: ps.skill.category,
          description: ps.skill.description ?? undefined,
          icon: ps.skill.icon ?? undefined,
          createdAt: ps.skill.created_at,
        },
      })),
      tasks: (updatedProject as any).tasks.map((task: any) => ({
        id: task.id,
        projectId: task.project_id,
        title: task.title,
        description: task.description ?? undefined,
        status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
        priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        assigneeId: task.assignee_id ?? undefined,
        dueDate: task.due_date ?? undefined,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
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

    if (project.owner_id !== userId) {
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
    const existingMember = await prisma.project_member.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of this project');
    }

    // Check if user is the owner
    if (project.owner_id === userId) {
      throw new Error('Project owner cannot request to join their own project');
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.join_request.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
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
    const joinRequest = await prisma.join_request.upsert({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
        },
      },
      update: {
        message: requestData.message,
        status: 'PENDING',
        updated_at: new Date(),
      },
      create: {
        project_id: projectId,
        user_id: userId,
        message: requestData.message,
        status: 'PENDING',
      },
      include: {
        user: {
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
        },
        project: {
          include: {
            owner: {
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
            },
            members: {
              include: {
                user: {
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
                },
              },
            },
            required_skills: {
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
      projectId: joinRequest.project_id,
      userId: joinRequest.user_id,
      message: joinRequest.message ?? undefined,
      status: joinRequest.status as 'PENDING' | 'ACCEPTED' | 'REJECTED',
      createdAt: joinRequest.created_at,
      updatedAt: joinRequest.updated_at,
      user: joinRequest.user as any,
      project: {
        id: joinRequest.project.id,
        title: joinRequest.project.title ?? undefined,
        description: joinRequest.project.description ?? undefined,
        status: joinRequest.project.status as 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED',
        type: joinRequest.project.type as 'ACADEMIC' | 'PERSONAL' | 'COMPETITION' | 'INTERNSHIP',
        maxMembers: joinRequest.project.max_members ?? undefined,
        startDate: joinRequest.project.start_date ?? undefined,
        endDate: joinRequest.project.end_date ?? undefined,
        githubUrl: joinRequest.project.github_url ?? undefined,
        liveUrl: joinRequest.project.live_url ?? undefined,
        ownerId: joinRequest.project.owner_id,
        createdAt: joinRequest.project.created_at,
        updatedAt: joinRequest.project.updated_at,
        owner: joinRequest.project.owner as any,
        members: joinRequest.project.members.map(member => ({
          id: member.id,
          projectId: member.project_id,
          userId: member.user_id,
          role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
          joinedAt: member.joined_at,
          user: member.user as any,
        })),
        requiredSkills: (joinRequest.project as any).required_skills.map((ps: any) => ({
          id: ps.id,
          projectId: ps.project_id,
          skillId: ps.skill_id,
          required: ps.required,
          skill: {
            id: ps.skill.id,
            name: ps.skill.name,
            category: ps.skill.category,
            description: ps.skill.description,
            icon: ps.skill.icon,
            createdAt: ps.skill.created_at,
          },
        })),
        tasks: (joinRequest.project as any).tasks.map((task: any) => ({
          id: task.id,
          projectId: task.project_id,
          title: task.title,
          description: task.description,
          status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
          assigneeId: task.assignee_id,
          dueDate: task.due_date,
          createdAt: task.created_at,
          updatedAt: task.updated_at,
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

    if (project.owner_id !== userId) {
      throw new Error('Only project owner can accept/reject join requests');
    }

    // Check if join request exists
    const joinRequest = await prisma.join_request.findUnique({
      where: { id: requestId },
    });

    if (!joinRequest) {
      throw new Error('Join request not found');
    }

    if (joinRequest.project_id !== projectId) {
      throw new Error('Join request does not belong to this project');
    }

    if (joinRequest.status !== 'PENDING') {
      throw new Error('Join request has already been processed');
    }

    // Update join request status
    await prisma.join_request.update({
      where: { id: requestId },
      data: { status },
    });

    // If accepted, add user to project members
    if (status === 'ACCEPTED') {
      // Check if project has reached max members
      if (project.max_members) {
        const memberCount = await prisma.project_member.count({
          where: { project_id: projectId },
        });

        if (memberCount >= project.max_members) {
          throw new Error('Project has reached maximum number of members');
        }
      }

      await prisma.project_member.create({
        data: {
          project_id: projectId,
          user_id: joinRequest.user_id,
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
    const members = await prisma.project_member.findMany({
      where: { project_id: projectId },
      include: {
        user: {
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
        },
      },
      orderBy: { joined_at: 'asc' },
    });

    return members.map(member => ({
      id: member.id,
      projectId: member.project_id,
      userId: member.user_id,
      role: member.role as 'MEMBER' | 'COLLABORATOR' | 'MAINTAINER',
      joinedAt: member.joined_at,
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
    const isOwner = project.owner_id === userId;
    const isMember = await prisma.project_member.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
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
      const assigneeMember = await prisma.project_member.findUnique({
        where: {
          project_id_user_id: {
            project_id: projectId,
            user_id: taskData.assigneeId,
          },
        },
      });

      if (!assigneeMember && project.owner_id !== taskData.assigneeId) {
        throw new Error('Assignee must be a project member');
      }
    }

    const task = await prisma.task.create({
      data: {
        project_id: projectId,
        title: taskData.title,
        description: taskData.description,
        status: 'TODO',
        priority: taskData.priority,
        assignee_id: taskData.assigneeId ?? undefined,
        due_date: taskData.dueDate ?? undefined,
      },
      include: {
        assignee: {
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
        },
      },
    });

    return {
      id: task.id,
      projectId: task.project_id,
      title: task.title,
      description: task.description ?? undefined,
      status: task.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
      priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      assigneeId: task.assignee_id ?? undefined,
      dueDate: task.due_date ?? undefined,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
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

    if (task.project_id !== projectId) {
      throw new Error('Task does not belong to this project');
    }

    // Check if user is a member or owner
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const isOwner = project.owner_id === userId;
    const isMember = await prisma.project_member.findUnique({
      where: {
        project_id_user_id: {
          project_id: projectId,
          user_id: userId,
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
      const assigneeMember = await prisma.project_member.findUnique({
        where: {
          project_id_user_id: {
            project_id: projectId,
            user_id: updateData.assigneeId,
          },
        },
      });

      if (!assigneeMember && project.owner_id !== updateData.assigneeId) {
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
            first_name: true,
            last_name: true,
            roll_number: true,
            department: true,
            year: true,
            semester: true,
            avatar: true,
            is_verified: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    return {
      id: updatedTask.id,
      projectId: updatedTask.project_id,
      title: updatedTask.title,
      description: updatedTask.description ?? undefined,
      status: updatedTask.status as 'TODO' | 'IN_PROGRESS' | 'COMPLETED',
      priority: updatedTask.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      assigneeId: updatedTask.assignee_id ?? undefined,
      dueDate: updatedTask.due_date ?? undefined,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
      assignee: (updatedTask as any).assignee as any,
    };
  }
}