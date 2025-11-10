import { Request, Response, NextFunction } from 'express';
import { PostService } from '../services/postService';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/error';
import { CreatePostData, UpdatePostData, PostSearchParams, CreateCommentData, UpdateCommentData } from '../types';

export class PostController {
  /**
   * Create new post
   */
  static createPost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = (req as any).user.id;
    const postData: CreatePostData = req.body;
    
    const post = await PostService.createPost(authorId, postData);
    
    ResponseUtils.created(res, post, 'Post created successfully');
  });

  /**
   * Get posts with filters
   */
  static getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchParams: PostSearchParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      type: req.query.type as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : [],
      search: req.query.search as string,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await PostService.getPosts(searchParams);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Get post by ID
   */
  static getPostById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    const post = await PostService.getPostById(id);
    
    ResponseUtils.success(res, post);
  });

  /**
   * Get comments for a post
   */
  static getPostComments = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const comments = await PostService.getPostComments(id);

    ResponseUtils.success(res, comments);
  });

  /**
   * Update post
   */
  static updatePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdatePostData = req.body;
    
    const post = await PostService.updatePost(id, userId, updateData);
    
    ResponseUtils.success(res, post, 'Post updated successfully');
  });

  /**
   * Delete post
   */
  static deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await PostService.deletePost(id, userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Create comment
   */
  static createComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const authorId = (req as any).user.id;
    const commentData: CreateCommentData = req.body;
    
    const comment = await PostService.createComment(id, authorId, commentData);
    
    ResponseUtils.created(res, comment, 'Comment added successfully');
  });

  /**
   * Update comment
   */
  static updateComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, commentId } = req.params;
    const userId = (req as any).user.id;
    const updateData: UpdateCommentData = req.body;
    
    const comment = await PostService.updateComment(id, commentId, userId, updateData);
    
    ResponseUtils.success(res, comment, 'Comment updated successfully');
  });

  /**
   * Delete comment
   */
  static deleteComment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, commentId } = req.params;
    const userId = (req as any).user.id;
    
    const result = await PostService.deleteComment(id, commentId, userId);
    
    ResponseUtils.success(res, result);
  });

  /**
   * Like/unlike post
   */
  static likePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    
    const result = await PostService.likePost(id, userId);
    
    ResponseUtils.success(res, result);
  });
}
