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

// Public routes
router.get('/', searchLimiter, searchProjectsValidation, handleValidationErrors, ProjectController.getProjects);
router.get('/:id', projectIdValidation, handleValidationErrors, ProjectController.getProjectById);
router.get('/:id/members', projectIdValidation, handleValidationErrors, ProjectController.getProjectMembers);

// Protected routes
router.use(authenticateToken);

// Project CRUD
router.post('/', createProjectValidation, handleValidationErrors, ProjectController.createProject);
router.put('/:id', projectIdValidation, updateProjectValidation, handleValidationErrors, ProjectController.updateProject);
router.delete('/:id', projectIdValidation, ProjectController.deleteProject);

// Join requests
router.post('/:id/join-request', projectIdValidation, joinRequestValidation, handleValidationErrors, ProjectController.requestToJoinProject);
router.put('/:id/join-request/:requestId', projectIdValidation, joinRequestIdValidation, updateJoinRequestValidation, handleValidationErrors, ProjectController.updateJoinRequest);

// Tasks
router.post('/:id/tasks', projectIdValidation, createTaskValidation, handleValidationErrors, ProjectController.createTask);
router.put('/:id/tasks/:taskId', projectIdValidation, taskIdValidation, updateTaskValidation, handleValidationErrors, ProjectController.updateTask);

export default router;
