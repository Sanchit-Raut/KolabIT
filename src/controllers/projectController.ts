import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreateProjectData, UpdateProjectData, ProjectSearchParams, CreateJoinRequestData, CreateTaskData, UpdateTaskData } from '../types';

export class ProjectController {
  /**
   * Create new project
   */
  static createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = (req as any).user.id;
    const projectData: CreateProjectData = req.body;
    
    const project = await ProjectService.createProject(ownerId, projectData);
    
    ResponseUtils.created(res, project, 'Project created successfully');
  });

  /**
   * Get projects with filters
   */
  static getProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: ProjectSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      skills: req.query.skills ? (req.query.skills as string).split(',') : [],
      status: req.query.status as string,
      type: req.query.type as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await ProjectService.getProjects(searchParams);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get project by ID
   */
  static getProjectById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const project = await ProjectService.getProjectById(id);
    
    ResponseUtils.success(res, project);
  });

  /**
   * Update project
   */
  static updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdateProjectData = req.body;
    
    const project = await ProjectService.updateProject(id, userId, updateData);
    
    ResponseUtils.success(res, project, 'Project updated successfully');
  });

  /**
   * Delete project
   */
  static deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await ProjectService.deleteProject(id, userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Request to join project
   */
  static requestToJoinProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const requestData: CreateJoinRequestData = req.body;
    
    const joinRequest = await ProjectService.requestToJoinProject(id, userId, requestData);
    
    ResponseUtils.created(res, joinRequest, 'Join request sent successfully');
  });

  /**
   * Update join request (accept/reject)
   */
  static updateJoinRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, requestId } = req.params;
    const userId = (req as any).user.id;
    const { status } = req.body;
    
    const result = await ProjectService.updateJoinRequest(id, requestId, userId, status);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get projects by user ID
   */
  static getProjectsByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    const projects = await ProjectService.getProjectsByUser(userId);
    
    ResponseUtils.success(res, projects);
  });

  /**
   * Get project members
   */
  static getProjectMembers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const members = await ProjectService.getProjectMembers(id);
    
    ResponseUtils.success(res, members);
  });

  /**
   * Create project task
   */
  static createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const taskData: CreateTaskData = req.body;
    
    const task = await ProjectService.createTask(id, userId, taskData);
    
    ResponseUtils.created(res, task, 'Task created successfully');
  });

  /**
   * Update project task
   */
  static updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, taskId } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdateTaskData = req.body;
    
    const task = await ProjectService.updateTask(id, taskId, userId, updateData);
    
    ResponseUtils.success(res, task, 'Task updated successfully');
  });

  /**
   * Get join requests for a project (owner only)
   */
  static getJoinRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const joinRequests = await ProjectService.getJoinRequests(id, userId);
    
    ResponseUtils.success(res, joinRequests);
  });

  /**
   * Get user's join requests
   */
  static getMyJoinRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    
    const joinRequests = await ProjectService.getMyJoinRequests(userId);
    
    ResponseUtils.success(res, joinRequests);
  });

  /**
   * Get project resources
   */
  static getProjectResources = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const resources = await ProjectService.getProjectResources(id);
    
    ResponseUtils.success(res, resources);
  });

  /**
   * Link resource to project
   */
  static linkResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { resourceId } = req.body;
    
    const result = await ProjectService.linkResource(id, resourceId, userId);
    
    ResponseUtils.created(res, result, 'Resource linked to project');
  });

  /**
   * Unlink resource from project
   */
  static unlinkResource = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, resourceId } = req.params;
    const userId = (req as any).user.id;
    
    const result = await ProjectService.unlinkResource(id, resourceId, userId);
    
    ResponseUtils.success(res, result, 'Resource unlinked from project');
  });
}
