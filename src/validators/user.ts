import { body, query, param } from 'express-validator';

export const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('rollNumber')
    .optional()
    .trim()
    .isNumeric()
    .withMessage('Roll number must contain only numbers')
    .isLength({ min: 1, max: 20 })
    .withMessage('Roll number must be between 1 and 20 digits'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  
  body('year')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Year must be between 1 and 5'),
  
  body('semester')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be between 1 and 10'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
];

export const searchUsersValidation = [
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
    .customSanitizer((value) => {
      // Normalize skills to always be an array
      if (!value) return [];
      if (Array.isArray(value)) return value;
      // Single string value - convert to array
      return [value];
    })
    .isArray()
    .withMessage('Skills must be an array'),
  
  query('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  
  query('year')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 5 })
    .withMessage('Year must be between 1 and 5'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
];

export const addUserSkillValidation = [
  // Skill IDs are UUIDs in the database, validate accordingly
  body('skillId')
    .isUUID()
    .withMessage('Skill ID must be a valid ID'),
  
  body('proficiency')
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
    .withMessage('Proficiency must be one of: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT'),
  
  body('yearsOfExp')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
];

export const updateUserSkillValidation = [
  // skillId comes from route params for update
  param('skillId')
    .isUUID()
    .withMessage('Skill ID must be a valid ID'),

  body('proficiency')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'])
    .withMessage('Proficiency must be one of: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT'),

  body('yearsOfExp')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
];
