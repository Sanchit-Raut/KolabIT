import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes (require authentication)
router.get('/my', authenticateToken, AnalyticsController.getMyAnalytics);
router.get('/my/report', authenticateToken, AnalyticsController.getMyReport);
router.get('/my/engagement', authenticateToken, AnalyticsController.getMyEngagementScore);

// Public route (increments view count)
router.get('/user/:userId', AnalyticsController.getUserAnalytics);

export default router;
