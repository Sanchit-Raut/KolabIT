import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// User management
router.post('/users/:userId/ban', AdminController.banUser);
router.post('/users/:userId/unban', AdminController.unbanUser);
router.delete('/users/:userId', AdminController.deleteUser);
router.post('/users/:userId/warn', AdminController.warnUser);
router.get('/users/:userId/warnings', AdminController.getUserWarnings);
router.get('/users', AdminController.getAllUsers);
router.get('/banned-users', AdminController.getBannedUsers);
router.get('/warnings', AdminController.getAllWarnings);

// Content moderation
router.delete('/comments/:commentId', AdminController.deleteComment);
router.delete('/ratings/:ratingId', AdminController.deleteRating);
router.delete('/projects/:projectId', AdminController.deleteProject);
router.delete('/posts/:postId', AdminController.deletePost);
router.delete('/resources/:resourceId', AdminController.deleteResource);

// Audit log
router.get('/actions', AdminController.getAdminActions);

export default router;
