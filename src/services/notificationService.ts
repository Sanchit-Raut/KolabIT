import prisma from '../config/database';
import { NotificationData, CreateNotificationData, PaginatedResponse } from '../types';

export class NotificationService {
  /**
   * Get user notifications
   */
  static async getNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<NotificationData>> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { user_id: userId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: notifications.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.is_read,
        data: notification.data,
        createdAt: notification.created_at,
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
   * Create notification
   */
  static async createNotification(notificationData: CreateNotificationData): Promise<NotificationData> {
    const notification = await prisma.notification.create({
      data: notificationData,
    });

    return {
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.is_read,
      data: notification.data,
      createdAt: notification.created_at,
    };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string): Promise<{ message: string }> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new Error('Unauthorized to modify this notification');
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });

    return { message: 'Notification marked as read' };
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<{ message: string }> {
    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });

    return { message: 'All notifications marked as read' };
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<{ message: string }> {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new Error('Unauthorized to delete this notification');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted successfully' };
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });

    return { count };
  }

  /**
   * Send project invitation notification
   */
  static async sendProjectInvitationNotification(
    userId: string,
    projectTitle: string,
    inviterName: string,
    projectId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'PROJECT_INVITE',
      title: 'Project Invitation',
      message: `${inviterName} has invited you to join "${projectTitle}"`,
      data: { projectId, inviterName, projectTitle },
    });
  }

  /**
   * Send skill endorsement notification
   */
  static async sendSkillEndorsementNotification(
    userId: string,
    skillName: string,
    endorserName: string,
    skillId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'SKILL_ENDORSEMENT',
      title: 'Skill Endorsed',
      message: `${endorserName} has endorsed your ${skillName} skill`,
      data: { skillId, skillName, endorserName },
    });
  }

  /**
   * Send badge earned notification
   */
  static async sendBadgeEarnedNotification(
    userId: string,
    badgeName: string,
    badgeId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'BADGE_EARNED',
      title: 'Badge Earned!',
      message: `Congratulations! You've earned the "${badgeName}" badge`,
      data: { badgeId, badgeName },
    });
  }

  /**
   * Send join request notification
   */
  static async sendJoinRequestNotification(
    userId: string,
    projectTitle: string,
    requesterName: string,
    projectId: string,
    requestId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'JOIN_REQUEST',
      title: 'Join Request',
      message: `${requesterName} wants to join your project "${projectTitle}"`,
      data: { projectId, projectTitle, requesterName, requestId },
    });
  }

  /**
   * Send join request response notification
   */
  static async sendJoinRequestResponseNotification(
    userId: string,
    projectTitle: string,
    status: 'ACCEPTED' | 'REJECTED',
    projectId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'JOIN_REQUEST_RESPONSE',
      title: 'Join Request Response',
      message: `Your request to join "${projectTitle}" has been ${status.toLowerCase()}`,
      data: { projectId, projectTitle, status },
    });
  }

  /**
   * Send resource rating notification
   */
  static async sendResourceRatingNotification(
    userId: string,
    resourceTitle: string,
    rating: number,
    reviewerName: string,
    resourceId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'RESOURCE_RATING',
      title: 'Resource Rated',
      message: `${reviewerName} rated your resource "${resourceTitle}" ${rating} stars`,
      data: { resourceId, resourceTitle, rating, reviewerName },
    });
  }

  /**
   * Send comment notification
   */
  static async sendCommentNotification(
    userId: string,
    postTitle: string,
    commenterName: string,
    postId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'COMMENT',
      title: 'New Comment',
      message: `${commenterName} commented on your post "${postTitle}"`,
      data: { postId, postTitle, commenterName },
    });
  }

  /**
   * Send like notification
   */
  static async sendLikeNotification(
    userId: string,
    postTitle: string,
    likerName: string,
    postId: string
  ): Promise<void> {
    await this.createNotification({
      userId,
      type: 'LIKE',
      title: 'Post Liked',
      message: `${likerName} liked your post "${postTitle}"`,
      data: { postId, postTitle, likerName },
    });
  }
}