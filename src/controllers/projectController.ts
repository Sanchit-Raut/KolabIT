import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreateProjectData, UpdateProjectData, ProjectSearchParams, CreateJoinRequestData, CreateTaskData, UpdateTaskData } from '../types';

export class ProjectController {
  static createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const owner_id = (req as any).user.id;
    const projectData: CreateProjectData = req.body;
    const project = await ProjectService.createProject(owner_id, projectData);
    ResponseUtils.created(res, project, 'Project created successfully');
  });

  static getProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: ProjectSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      skills: req.query.skills ? (req.query.skills as string).split(',') : [],
      status: req.query.status as string,
      type: req.query.type as string,
      search: req.query.search as string,
      sort_by: req.query.sortBy as string || 'created_at',
      sort_order: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };
    const result = await ProjectService.getProjects(searchParams);
    ResponseUtils.success(res, result);
  });

  static getProjectById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    ResponseUtils.success(res, project);
  });

  static updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const updateData: UpdateProjectData = req.body;
    const project = await ProjectService.updateProject(id, user_id, updateData);
    ResponseUtils.success(res, project, 'Project updated successfully');
  });

  static deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const result = await ProjectService.deleteProject(id, user_id);
    ResponseUtils.success(res, result);
  });

  static requestToJoinProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const requestData: CreateJoinRequestData = req.body;
    const joinRequest = await ProjectService.requestToJoinProject(id, user_id, requestData);
    ResponseUtils.created(res, joinRequest, 'Join request sent successfully');
  });

  static updateJoinRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, request_id } = req.params as any;
    const user_id = (req as any).user.id;
    const { status } = req.body;
    const result = await ProjectService.updateJoinRequest(id, request_id, user_id, status);
    ResponseUtils.success(res, result);
  });

  static getProjectMembers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const members = await ProjectService.getProjectMembers(id);
    ResponseUtils.success(res, members);
  });

  static createTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const taskData: CreateTaskData = req.body;
    const task = await ProjectService.createTask(id, user_id, taskData);
    ResponseUtils.created(res, task, 'Task created successfully');
  });

  static updateTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, task_id } = req.params as any;
    const user_id = (req as any).user.id;
    const updateData: UpdateTaskData = req.body;
    const task = await ProjectService.updateTask(id, task_id, user_id, updateData);
    ResponseUtils.success(res, task, 'Task updated successfully');
  });
}
