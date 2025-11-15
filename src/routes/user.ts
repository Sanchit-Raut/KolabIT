import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { searchLimiter } from '../middleware/rateLimit';
import { handleValidationErrors } from '../middleware/validation';
import {
  searchUsersValidation,
  addUserSkillValidation,
  updateUserSkillValidation,
} from '../validators/user';

const router = Router();

// Public routes
router.get('/search', searchLimiter, searchUsersValidation, handleValidationErrors, UserController.searchUsers);
router.get('/:userId', UserController.getUserById);
router.get('/:userId/skills', UserController.getUserSkills);
router.get('/:userId/stats', UserController.getUserStats);
router.get('/:skillId/users', searchLimiter, UserController.getUsersWithSkill);

// Protected routes
router.use(authenticateToken);

router.post('/skills', addUserSkillValidation, handleValidationErrors, UserController.addUserSkill);
router.put('/skills/:skillId', updateUserSkillValidation, handleValidationErrors, UserController.updateUserSkill);
router.delete('/skills/:skillId', UserController.removeUserSkill);
router.post('/:userId/skills/:skillId/endorse', UserController.endorseUserSkill);

export default router;
