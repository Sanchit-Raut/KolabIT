import prisma from '../config/database';
import { MessageData } from '../types';

export class MessageService {
  /**
   * Get all messages for a user
   */
  static async getUserMessages(userId: string): Promise<MessageData[]> {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          }
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      recipientId: message.recipientId,
      sender: message.sender,
      recipient: message.recipient,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));
  }

  /**
   * Get messages between two users
   */
  static async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<MessageData[]> {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { 
            AND: [
              { senderId: userId1 },
              { recipientId: userId2 }
            ]
          },
          {
            AND: [
              { senderId: userId2 },
              { recipientId: userId1 }
            ]
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          }
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      recipientId: message.recipientId,
      sender: message.sender,
      recipient: message.recipient,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));
  }

  /**
   * Send a message
   */
  static async sendMessage(senderId: string, recipientId: string, content: string): Promise<MessageData> {
    // Check if recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        recipientId
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          }
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isVerified: true,
          }
        }
      }
    });

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'MESSAGE',
        content: `New message from ${message.sender.firstName} ${message.sender.lastName}`,
        link: `/messages/${senderId}`,
        read: false
      }
    });

    return {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      recipientId: message.recipientId,
      sender: message.sender,
      recipient: message.recipient,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  /**
   * Delete a message
   */
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('Only message sender can delete the message');
    }

    await prisma.message.delete({
      where: { id: messageId }
    });
  }
}