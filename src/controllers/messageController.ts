import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/messageService';
import { asyncHandler } from '../utils/asyncHandler';
import { ResponseUtils } from '../utils/response';

export class MessageController {
  /**
   * Get all messages for current user
   */
  static getUserMessages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const messages = await MessageService.getUserMessages(userId);
    ResponseUtils.success(res, messages);
  });

  /**
   * Get messages between current user and another user
   */
  static getMessagesWith = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { recipientId } = req.params;
    const messages = await MessageService.getMessagesBetweenUsers(userId, recipientId);
    ResponseUtils.success(res, messages);
  });

  /**
   * Send a message to another user
   */
  static sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const senderId = (req as any).user.id;
    const { recipientId } = req.params;
    const { content } = req.body;

    const message = await MessageService.sendMessage(senderId, recipientId, content);
    ResponseUtils.success(res, message, 'Message sent successfully');
  });

  /**
   * Delete a message
   */
  static deleteMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { messageId } = req.params;

    await MessageService.deleteMessage(messageId, userId);
    ResponseUtils.success(res, null, 'Message deleted successfully');
  });
}