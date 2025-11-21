import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

// Create a report (authenticated users only)
router.post('/', authenticateToken, ReportController.createReport);

// Get all reports (admin only)
router.get('/', authenticateToken, requireAdmin, ReportController.getReports);

// Get specific report (admin only)
router.get('/:id', authenticateToken, requireAdmin, ReportController.getReportById);

// Update report status (admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, ReportController.updateReportStatus);

export default router;
