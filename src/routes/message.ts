import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { 
  createMessageValidation,
  messageIdValidation,
  recipientIdValidation 
} from '../validators/message';

const router = Router();

// Protected routes
router.use(authenticateToken);

// Message routes
router.get('/', MessageController.getUserMessages);
router.get('/:recipientId', recipientIdValidation, handleValidationErrors, MessageController.getMessagesWith);
router.post('/:recipientId', recipientIdValidation, createMessageValidation, handleValidationErrors, MessageController.sendMessage);
router.delete('/:messageId', messageIdValidation, handleValidationErrors, MessageController.deleteMessage);

export default router;