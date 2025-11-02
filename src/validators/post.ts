import { body, query, param } from 'express-validator';

export const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('type')
    .isIn(['DISCUSSION', 'ANNOUNCEMENT', 'HELP', 'SHOWCASE'])
    .withMessage('Type must be one of: DISCUSSION, ANNOUNCEMENT, HELP, SHOWCASE'),
  
  body('tags')
    .isArray({ min: 1, max: 10 })
    .withMessage('Tags must be an array with 1-10 items'),
  
  body('tags.*')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Each tag must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Tags can only contain letters, numbers, spaces, and hyphens'),
];

export const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('type')
    .optional()
    .isIn(['DISCUSSION', 'ANNOUNCEMENT', 'HELP', 'SHOWCASE'])
    .withMessage('Type must be one of: DISCUSSION, ANNOUNCEMENT, HELP, SHOWCASE'),
  
  body('tags')
    .optional()
    .isArray({ min: 1, max: 10 })
    .withMessage('Tags must be an array with 1-10 items'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Each tag must be between 2 and 20 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Tags can only contain letters, numbers, spaces, and hyphens'),
];

export const searchPostsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('type')
    .optional()
    .isIn(['DISCUSSION', 'ANNOUNCEMENT', 'HELP', 'SHOWCASE'])
    .withMessage('Type must be one of: DISCUSSION, ANNOUNCEMENT, HELP, SHOWCASE'),
  
  query('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
];

export const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Content must be between 1 and 500 characters'),
];

export const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Content must be between 1 and 500 characters'),
];

export const postIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Post ID must be a valid UUID'),
];

export const commentIdValidation = [
  param('commentId')
    .isUUID()
    .withMessage('Comment ID must be a valid UUID'),
];
