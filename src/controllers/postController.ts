import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/postService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreatePostData, UpdatePostData, PostSearchParams, CreateCommentData, UpdateCommentData } from '../types';

export class PostController {
  static createPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const author_id = (req as any).user.id;
    const postData: CreatePostData = req.body;
    const post = await PostService.createPost(author_id, postData);
    ResponseUtils.created(res, post, 'Post created successfully');
  });

  static getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: PostSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      type: req.query.type as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : [],
      search: req.query.search as string,
      sort_by: req.query.sortBy as string || 'created_at',
      sort_order: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };
    const result = await PostService.getPosts(searchParams);
    ResponseUtils.success(res, result);
  });

  static getPostById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const post = await PostService.getPostById(id);
    ResponseUtils.success(res, post);
  });

  static updatePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const updateData: UpdatePostData = req.body;
    const post = await PostService.updatePost(id, user_id, updateData);
    ResponseUtils.success(res, post, 'Post updated successfully');
  });

  static deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const result = await PostService.deletePost(id, user_id);
    ResponseUtils.success(res, result);
  });

  static createComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const author_id = (req as any).user.id;
    const commentData: CreateCommentData = req.body;
    const comment = await PostService.createComment(id, author_id, commentData);
    ResponseUtils.created(res, comment, 'Comment added successfully');
  });

  static updateComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, comment_id } = req.params as any;
    const user_id = (req as any).user.id;
    const updateData: UpdateCommentData = req.body;
    const comment = await PostService.updateComment(id, comment_id, user_id, updateData);
    ResponseUtils.success(res, comment, 'Comment updated successfully');
  });

  static deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, comment_id } = req.params as any;
    const user_id = (req as any).user.id;
    const result = await PostService.deleteComment(id, comment_id, user_id);
    ResponseUtils.success(res, result);
  });

  static likePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user_id = (req as any).user.id;
    const result = await PostService.likePost(id, user_id);
    ResponseUtils.success(res, result);
  });
}
