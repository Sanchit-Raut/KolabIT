import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';
import { searchLimiter, uploadLimiter } from '../middleware/rateLimit';
import { handleValidationErrors } from '../middleware/validation';
import {
  createProjectValidation,
  updateProjectValidation,
  searchProjectsValidation,
  joinRequestValidation,
  updateJoinRequestValidation,
  projectIdValidation,
  joinRequestIdValidation,
} from '../validators/project';
import {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation,
} from '../validators/task';

const router = Router();

// Public routes (no auth required)
router.get('/', searchLimiter, searchProjectsValidation, handleValidationErrors, ProjectController.getProjects);
router.get('/user/:userId', ProjectController.getProjectsByUser);

// IMPORTANT: Auth-protected routes that look like IDs must come BEFORE generic /:id routes
// Apply authentication ONLY to these specific routes
router.get('/my-join-requests', authenticateToken, ProjectController.getMyJoinRequests);

// Public detail routes (must come AFTER specific routes like /my-join-requests)
router.get('/:id', projectIdValidation, handleValidationErrors, ProjectController.getProjectById);
router.get('/:id/members', projectIdValidation, handleValidationErrors, ProjectController.getProjectMembers);

// ALL ROUTES BELOW REQUIRE AUTHENTICATION
router.use(authenticateToken);

// Project CRUD (authenticated)
router.post('/', createProjectValidation, handleValidationErrors, ProjectController.createProject);
router.put('/:id', projectIdValidation, updateProjectValidation, handleValidationErrors, ProjectController.updateProject);
router.delete('/:id', projectIdValidation, ProjectController.deleteProject);
router.get('/:id/join-requests', projectIdValidation, handleValidationErrors, ProjectController.getJoinRequests);
router.post('/:id/join-request', projectIdValidation, joinRequestValidation, handleValidationErrors, ProjectController.requestToJoinProject);
router.put('/:id/join-request/:requestId', projectIdValidation, joinRequestIdValidation, updateJoinRequestValidation, handleValidationErrors, ProjectController.updateJoinRequest);

// Project resources
router.get('/:id/resources', projectIdValidation, handleValidationErrors, ProjectController.getProjectResources);
router.post('/:id/resources', projectIdValidation, handleValidationErrors, ProjectController.linkResource);
router.delete('/:id/resources/:resourceId', projectIdValidation, handleValidationErrors, ProjectController.unlinkResource);

// Tasks
router.post('/:id/tasks', projectIdValidation, createTaskValidation, handleValidationErrors, ProjectController.createTask);
router.put('/:id/tasks/:taskId', projectIdValidation, taskIdValidation, updateTaskValidation, handleValidationErrors, ProjectController.updateTask);

export default router;
