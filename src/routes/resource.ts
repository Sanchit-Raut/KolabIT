import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { searchLimiter, uploadLimiter } from '../middleware/rateLimit';
import { handleValidationErrors } from '../middleware/validation';
import { upload } from '../utils/file';
import {
  createResourceValidation,
  updateResourceValidation,
  searchResourcesValidation,
  resourceRatingValidation,
  resourceIdValidation,
  userIdValidation,
} from '../validators/resource';

const router = Router();

// Public routes
router.get('/', searchLimiter, searchResourcesValidation, handleValidationErrors, ResourceController.getResources);
router.get('/popular', ResourceController.getPopularResources);
router.get('/:id', optionalAuth, resourceIdValidation, handleValidationErrors, ResourceController.getResourceById);
router.get('/:id/ratings', resourceIdValidation, handleValidationErrors, ResourceController.getResourceRatings);
router.get('/:id/stats', resourceIdValidation, handleValidationErrors, ResourceController.getResourceStats);
router.post('/:id/download', resourceIdValidation, ResourceController.trackDownload);

// Protected routes
router.use(authenticateToken);

// Resource CRUD
router.post('/', uploadLimiter, upload.single('file'), createResourceValidation, handleValidationErrors, ResourceController.createResource);
router.get('/user/:userId', userIdValidation, searchResourcesValidation, handleValidationErrors, ResourceController.getResourcesByUser);
router.put('/:id', resourceIdValidation, updateResourceValidation, handleValidationErrors, ResourceController.updateResource);
router.delete('/:id', resourceIdValidation, ResourceController.deleteResource);

// Resource rating
router.post('/:id/rating', resourceIdValidation, resourceRatingValidation, handleValidationErrors, ResourceController.rateResource);

// Resource like/unlike
router.post('/:id/like', resourceIdValidation, handleValidationErrors, ResourceController.toggleLike);

export default router;
