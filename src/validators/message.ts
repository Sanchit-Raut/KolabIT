import { body, param } from 'express-validator';

export const createMessageValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
];

export const messageIdValidation = [
  param('messageId')
    .notEmpty()
    .withMessage('Message ID is required')
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    .withMessage('Invalid message ID format'),
];

export const recipientIdValidation = [
  param('recipientId')
    .notEmpty()
    .withMessage('Recipient ID is required')
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    .withMessage('Invalid recipient ID format'),
];