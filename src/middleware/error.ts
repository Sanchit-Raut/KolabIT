import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';
import config from '../config/environment';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Prisma errors
  if (error.code === 'P2002') {
    ResponseUtils.conflict(res, 'A record with this information already exists');
    return;
  }

  if (error.code === 'P2025') {
    ResponseUtils.notFound(res, 'Record not found');
    return;
  }

  if (error.code === 'P2003') {
    ResponseUtils.error(res, 'Foreign key constraint failed', 'FOREIGN_KEY_ERROR', 400);
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    ResponseUtils.unauthorized(res, 'Invalid token');
    return;
  }

  if (error.name === 'TokenExpiredError') {
    ResponseUtils.unauthorized(res, 'Token has expired');
    return;
  }

  // Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    ResponseUtils.error(res, 'File too large', 'FILE_TOO_LARGE', 400);
    return;
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    ResponseUtils.error(res, 'Too many files', 'TOO_MANY_FILES', 400);
    return;
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    ResponseUtils.error(res, 'Unexpected field', 'UNEXPECTED_FIELD', 400);
    return;
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    ResponseUtils.validationError(res, error.details || [error.message]);
    return;
  }

  // Custom application errors
  if (error.statusCode) {
    ResponseUtils.error(res, error.message, error.code || 'ERROR', error.statusCode);
    return;
  }

  // Default error
  const message = config.NODE_ENV === 'production' 
    ? 'Something went wrong' 
    : error.message || 'Internal server error';
  
  ResponseUtils.internalError(res, message);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  ResponseUtils.notFound(res, `Route ${req.originalUrl} not found`);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
