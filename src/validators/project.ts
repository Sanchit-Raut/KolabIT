import { body, query, param } from 'express-validator';

export const createProjectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('type')
    .isIn(['ACADEMIC', 'PERSONAL', 'COMPETITION', 'INTERNSHIP'])
    .withMessage('Type must be one of: ACADEMIC, PERSONAL, COMPETITION, INTERNSHIP'),
  
  body('maxMembers')
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage('Max members must be between 2 and 50'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  
  body('liveUrl')
    .optional()
    .isURL()
    .withMessage('Live URL must be a valid URL'),
  
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill must be specified'),
  
  body('requiredSkills.*')
    .isUUID()
    .withMessage('Each required skill must be a valid ID'),
];

export const updateProjectValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('status')
    .optional()
    .isIn(['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PLANNING, ACTIVE, COMPLETED, CANCELLED'),
  
  body('type')
    .optional()
    .isIn(['ACADEMIC', 'PERSONAL', 'COMPETITION', 'INTERNSHIP'])
    .withMessage('Type must be one of: ACADEMIC, PERSONAL, COMPETITION, INTERNSHIP'),
  
  body('maxMembers')
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage('Max members must be between 2 and 50'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  
  body('liveUrl')
    .optional()
    .isURL()
    .withMessage('Live URL must be a valid URL'),
];

export const searchProjectsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  query('status')
    .optional()
    .isIn(['PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PLANNING, ACTIVE, COMPLETED, CANCELLED'),
  
  query('type')
    .optional()
    .isIn(['ACADEMIC', 'PERSONAL', 'COMPETITION', 'INTERNSHIP'])
    .withMessage('Type must be one of: ACADEMIC, PERSONAL, COMPETITION, INTERNSHIP'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
];

export const joinRequestValidation = [
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters'),
];

export const updateJoinRequestValidation = [
  body('status')
    .isIn(['ACCEPTED', 'REJECTED'])
    .withMessage('Status must be either ACCEPTED or REJECTED'),
];

export const projectIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Project ID must be a valid ID'),
];

export const joinRequestIdValidation = [
  param('requestId')
    .isUUID()
    .withMessage('Join request ID must be a valid ID'),
];
