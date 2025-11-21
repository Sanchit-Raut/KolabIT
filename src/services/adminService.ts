import prisma from '../config/database';

export class AdminService {
  /**
   * Check if user is admin
   */
  static async isAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return user?.role === 'ADMIN';
  }

  /**
   * Ban a user
   */
  static async banUser(
    adminId: string,
    userId: string,
    reason: string
  ): Promise<{ message: string }> {
    // Check if admin
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new Error('Cannot ban another admin');
    }

    // Ban user and log action
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { isBanned: true },
      });

      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'BAN_USER',
          targetType: 'USER',
          targetId: userId,
          reason,
          details: {
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`,
          },
        },
      });

      // Send warning notification
      await tx.warning.create({
        data: {
          userId,
          issuerId: adminId,
          reason,
          message: 'Your account has been banned due to policy violations.',
          severity: 'HIGH',
        },
      });
    });

    return { message: 'User banned successfully' };
  }

  /**
   * Unban a user
   */
  static async unbanUser(
    adminId: string,
    userId: string
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });

    return { message: 'User unbanned successfully' };
  }

  /**
   * Delete a user (admin action)
   */
  static async deleteUserByAdmin(
    adminId: string,
    userId: string,
    reason: string
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'ADMIN') {
      throw new Error('Cannot delete another admin');
    }

    // Log action before deletion
    await prisma.adminAction.create({
      data: {
        adminId,
        actionType: 'DELETE_USER',
        targetType: 'USER',
        targetId: userId,
        reason,
        details: {
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
        },
      },
    });

    // Delete user (cascades will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Warn a user
   */
  static async warnUser(
    adminId: string,
    userId: string,
    reason: string,
    message: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
  ): Promise<{ warning: any }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const warning = await prisma.$transaction(async (tx) => {
      const newWarning = await tx.warning.create({
        data: {
          userId,
          issuerId: adminId,
          reason,
          message,
          severity,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          issuer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'WARN_USER',
          targetType: 'USER',
          targetId: userId,
          reason,
          details: {
            severity,
            message,
          },
        },
      });

      return newWarning;
    });

    return { warning };
  }

  /**
   * Delete a comment (with warning)
   */
  static async deleteComment(
    adminId: string,
    commentId: string,
    reason: string,
    warnUser: boolean = true
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    await prisma.$transaction(async (tx) => {
      // Log admin action
      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'DELETE_COMMENT',
          targetType: 'COMMENT',
          targetId: commentId,
          reason,
          details: {
            authorId: comment.authorId,
            authorName: `${comment.author.firstName} ${comment.author.lastName}`,
            content: comment.content.substring(0, 100),
          },
        },
      });

      // Warn user if requested
      if (warnUser) {
        await tx.warning.create({
          data: {
            userId: comment.authorId,
            issuerId: adminId,
            reason,
            message: `Your comment has been removed by admin: "${reason}"`,
            severity: 'MEDIUM',
          },
        });
      }

      // Send notification to comment author
      await tx.notification.create({
        data: {
          userId: comment.authorId,
          type: 'CONTENT_REMOVED',
          title: 'Comment Removed',
          message: `Your comment has been removed by an admin. Reason: ${reason}`,
        },
      });

      // Delete comment
      await tx.comment.delete({
        where: { id: commentId },
      });
    });

    return { message: 'Comment deleted successfully' };
  }

  /**
   * Delete a rating (with warning)
   */
  static async deleteRating(
    adminId: string,
    ratingId: string,
    reason: string,
    warnUser: boolean = true
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const rating = await prisma.resourceRating.findUnique({
      where: { id: ratingId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!rating) {
      throw new Error('Rating not found');
    }

    await prisma.$transaction(async (tx) => {
      // Log admin action
      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'DELETE_RATING',
          targetType: 'RATING',
          targetId: ratingId,
          reason,
          details: {
            userId: rating.userId,
            userName: `${rating.user.firstName} ${rating.user.lastName}`,
            rating: rating.rating,
            comment: rating.comment?.substring(0, 100),
          },
        },
      });

      // Warn user if requested
      if (warnUser) {
        await tx.warning.create({
          data: {
            userId: rating.userId,
            issuerId: adminId,
            reason,
            message: `Your rating has been removed by admin: "${reason}"`,
            severity: 'MEDIUM',
          },
        });
      }

      // Delete rating
      await tx.resourceRating.delete({
        where: { id: ratingId },
      });
    });

    return { message: 'Rating deleted successfully' };
  }

  /**
   * Delete a project (with warning)
   */
  static async deleteProject(
    adminId: string,
    projectId: string,
    reason: string,
    warnUser: boolean = true
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    await prisma.$transaction(async (tx) => {
      // Log admin action
      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'DELETE_PROJECT',
          targetType: 'PROJECT',
          targetId: projectId,
          reason,
          details: {
            ownerId: project.ownerId,
            ownerName: `${project.owner.firstName} ${project.owner.lastName}`,
            title: project.title,
          },
        },
      });

      // Warn owner if requested
      if (warnUser) {
        await tx.warning.create({
          data: {
            userId: project.ownerId,
            issuerId: adminId,
            reason,
            message: `Your project "${project.title}" has been removed by admin: "${reason}"`,
            severity: 'HIGH',
          },
        });
      }

      // Send notification to project owner
      await tx.notification.create({
        data: {
          userId: project.ownerId,
          type: 'CONTENT_REMOVED',
          title: 'Project Removed',
          message: `Your project "${project.title}" has been removed by an admin. Reason: ${reason}`,
        },
      });

      // Delete project
      await tx.project.delete({
        where: { id: projectId },
      });
    });

    return { message: 'Project deleted successfully' };
  }

  /**
   * Delete a post (with warning)
   */
  static async deletePost(
    adminId: string,
    postId: string,
    reason: string,
    warnUser: boolean = true
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    await prisma.$transaction(async (tx) => {
      // Log admin action
      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'DELETE_POST',
          targetType: 'POST',
          targetId: postId,
          reason,
          details: {
            authorId: post.authorId,
            authorName: `${post.author.firstName} ${post.author.lastName}`,
            title: post.title,
          },
        },
      });

      // Warn author if requested
      if (warnUser) {
        await tx.warning.create({
          data: {
            userId: post.authorId,
            issuerId: adminId,
            reason,
            message: `Your post "${post.title}" has been removed by admin: "${reason}"`,
            severity: 'MEDIUM',
          },
        });
      }

      // Send notification to post author
      await tx.notification.create({
        data: {
          userId: post.authorId,
          type: 'CONTENT_REMOVED',
          title: 'Post Removed',
          message: `Your post "${post.title}" has been removed by an admin. Reason: ${reason}`,
        },
      });

      // Delete post
      await tx.post.delete({
        where: { id: postId },
      });
    });

    return { message: 'Post deleted successfully' };
  }

  /**
   * Delete a resource (with warning)
   */
  static async deleteResource(
    adminId: string,
    resourceId: string,
    reason: string,
    warnUser: boolean = true
  ): Promise<{ message: string }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    await prisma.$transaction(async (tx) => {
      // Log admin action
      await tx.adminAction.create({
        data: {
          adminId,
          actionType: 'DELETE_RESOURCE',
          targetType: 'RESOURCE',
          targetId: resourceId,
          reason,
          details: {
            uploaderId: resource.uploaderId,
            uploaderName: `${resource.uploader.firstName} ${resource.uploader.lastName}`,
            title: resource.title,
          },
        },
      });

      // Warn uploader if requested
      if (warnUser) {
        await tx.warning.create({
          data: {
            userId: resource.uploaderId,
            issuerId: adminId,
            reason,
            message: `Your resource "${resource.title}" has been removed by admin: "${reason}"`,
            severity: 'MEDIUM',
          },
        });
      }

      // Send notification to resource uploader
      await tx.notification.create({
        data: {
          userId: resource.uploaderId,
          type: 'CONTENT_REMOVED',
          title: 'Resource Removed',
          message: `Your resource "${resource.title}" has been removed by an admin. Reason: ${reason}`,
        },
      });

      // Delete resource
      await tx.resource.delete({
        where: { id: resourceId },
      });
    });

    return { message: 'Resource deleted successfully' };
  }

  /**
   * Get all admin actions (audit log)
   */
  static async getAdminActions(
    adminId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ actions: any[]; total: number }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const [actions, total] = await Promise.all([
      prisma.adminAction.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.adminAction.count(),
    ]);

    return { actions, total };
  }

  /**
   * Get user warnings
   */
  static async getUserWarnings(
    adminId: string,
    userId: string
  ): Promise<{ warnings: any[] }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const warnings = await prisma.warning.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        issuer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return { warnings };
  }

  /**
   * Get all users (for admin management)
   */
  static async getAllUsers(
    adminId: string,
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<{ users: any[]; total: number; page: number; totalPages: number }> {
    const isAdmin = await this.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { rollNumber: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          rollNumber: true,
          department: true,
          year: true,
          isVerified: true,
          role: true,
          isBanned: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              projects: true,
              resources: true,
              warnings: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all banned users
   */
  static async getBannedUsers(): Promise<any[]> {
    const bannedUsers = await prisma.user.findMany({
      where: { isBanned: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    // Get ban details from admin actions
    const bannedUsersWithDetails = await Promise.all(
      bannedUsers.map(async (user) => {
        const banAction = await prisma.adminAction.findFirst({
          where: {
            targetId: user.id,
            actionType: 'BAN_USER',
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            admin: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });

        return {
          id: `ban-${user.id}`,
          userId: user.id,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          reason: banAction?.reason || 'No reason provided',
          bannedAt: banAction?.createdAt || user.createdAt,
          bannedBy: banAction?.admin || null,
          isPermanent: true,
        };
      })
    );

    return bannedUsersWithDetails;
  }

  /**
   * Get all warnings
   */
  static async getAllWarnings(): Promise<any[]> {
    const warnings = await prisma.warning.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        issuedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return warnings;
  }
}
