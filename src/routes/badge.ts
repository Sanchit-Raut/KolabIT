import { Router } from 'express';
import { BadgeController } from '../controllers/badgeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', BadgeController.getAllBadges);
router.get('/:userId', BadgeController.getUserBadges);

// Protected routes
router.use(authenticateToken);

router.post('/check', BadgeController.checkAndAwardBadges);
router.get('/leaderboard/:skillId?', BadgeController.getLeaderboard);

export default router;
