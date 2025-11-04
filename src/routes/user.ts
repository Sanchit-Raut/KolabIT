import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { searchLimiter } from '../middleware/rateLimit';
import { handleValidationErrors } from '../middleware/validation';
import {
  searchUsersValidation,
  addUserSkillValidation,
} from '../validators/user';

const router = Router();

// Public routes
router.get('/search', searchLimiter, searchUsersValidation, handleValidationErrors, UserController.searchUsers);
router.get('/:user_id', UserController.getUserById);
router.get('/:user_id/skills', UserController.getUserSkills);
router.get('/:user_id/stats', UserController.getUserStats);
router.get('/:skill_id/users', searchLimiter, UserController.getUsersWithSkill);

// Protected routes
router.use(authenticateToken);

router.post('/skills', addUserSkillValidation, handleValidationErrors, UserController.addUserSkill);
router.put('/skills/:skill_id', addUserSkillValidation, handleValidationErrors, UserController.updateUserSkill);
router.delete('/skills/:skill_id', UserController.removeUserSkill);
router.post('/:user_id/skills/:skill_id/endorse', UserController.endorseUserSkill);

export default router;
