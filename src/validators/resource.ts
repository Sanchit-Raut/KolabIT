import { body, query, param } from 'express-validator';

export const createResourceValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('type')
    .isIn(['PDF', 'DOC', 'VIDEO', 'LINK', 'CODE'])
    .withMessage('Type must be one of: PDF, DOC, VIDEO, LINK, CODE'),
  
  body('subject')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject must be between 2 and 100 characters'),
  
  body('semester')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be between 1 and 10'),
  
  body('file_url')
    .optional()
    .isURL()
    .withMessage('File URL must be a valid URL'),
  
  body('file_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name must be between 1 and 255 characters'),
  
  body('file_size')
    .optional()
    .isInt({ min: 1 })
    .withMessage('File size must be a positive integer'),
];

export const updateResourceValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  
  body('type')
    .optional()
    .isIn(['PDF', 'DOC', 'VIDEO', 'LINK', 'CODE'])
    .withMessage('Type must be one of: PDF, DOC, VIDEO, LINK, CODE'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject must be between 2 and 100 characters'),
  
  body('semester')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be between 1 and 10'),
  
  body('file_url')
    .optional()
    .isURL()
    .withMessage('File URL must be a valid URL'),
  
  body('file_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name must be between 1 and 255 characters'),
  
  body('file_size')
    .optional()
    .isInt({ min: 1 })
    .withMessage('File size must be a positive integer'),
];

export const searchResourcesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('subject')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject must be between 2 and 100 characters'),
  
  query('type')
    .optional()
    .isIn(['PDF', 'DOC', 'VIDEO', 'LINK', 'CODE'])
    .withMessage('Type must be one of: PDF, DOC, VIDEO, LINK, CODE'),
  
  query('semester')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be between 1 and 10'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
];

export const resourceRatingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review must not exceed 500 characters'),
];

export const resourceIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Resource ID must be a valid UUID'),
];
