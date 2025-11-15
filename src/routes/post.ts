import { Router } from 'express';
import { PostController } from '../controllers/postController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { searchLimiter } from '../middleware/rateLimit';
import { handleValidationErrors } from '../middleware/validation';
import {
  createPostValidation,
  updatePostValidation,
  searchPostsValidation,
  createCommentValidation,
  updateCommentValidation,
  postIdValidation,
  commentIdValidation,
} from '../validators/post';

const router = Router();

// Public routes
router.get('/', searchLimiter, searchPostsValidation, handleValidationErrors, PostController.getPosts);
// Comments (public read)
router.get('/:id/comments', postIdValidation, handleValidationErrors, PostController.getPostComments);
router.get('/:id', postIdValidation, handleValidationErrors, PostController.getPostById);

// Protected routes
router.use(authenticateToken);

// Post CRUD
router.post('/', createPostValidation, handleValidationErrors, PostController.createPost);
router.put('/:id', postIdValidation, updatePostValidation, handleValidationErrors, PostController.updatePost);
router.delete('/:id', postIdValidation, PostController.deletePost);

// Comments
router.post('/:id/comments', postIdValidation, createCommentValidation, handleValidationErrors, PostController.createComment);
router.put('/:id/comments/:commentId', postIdValidation, commentIdValidation, updateCommentValidation, handleValidationErrors, PostController.updateComment);
router.delete('/:id/comments/:commentId', postIdValidation, commentIdValidation, PostController.deleteComment);

// Likes
router.post('/:id/like', postIdValidation, PostController.likePost);

export default router;
