import { Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types';

export class ResponseUtils {
  /**
   * Send success response
   */
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): void {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
    };
    res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response, 
    message: string, 
    code: string = 'ERROR', 
    statusCode: number = 400,
    details?: any
  ): void {
    const response: ErrorResponse = {
      success: false,
      error: {
        message,
        code,
        details,
      },
    };
    res.status(statusCode).json(response);
  }

  /**
   * Send validation error response
   */
  static validationError(res: Response, errors: any[]): void {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
      },
    };
    res.status(400).json(response);
  }

  /**
   * Send unauthorized error response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    this.error(res, message, 'UNAUTHORIZED', 401);
  }

  /**
   * Send forbidden error response
   */
  static forbidden(res: Response, message: string = 'Forbidden'): void {
    this.error(res, message, 'FORBIDDEN', 403);
  }

  /**
   * Send not found error response
   */
  static notFound(res: Response, message: string = 'Resource not found'): void {
    this.error(res, message, 'NOT_FOUND', 404);
  }

  /**
   * Send conflict error response
   */
  static conflict(res: Response, message: string = 'Resource already exists'): void {
    this.error(res, message, 'CONFLICT', 409);
  }

  /**
   * Send internal server error response
   */
  static internalError(res: Response, message: string = 'Internal server error'): void {
    this.error(res, message, 'INTERNAL_ERROR', 500);
  }

  /**
   * Send created response
   */
  static created<T>(res: Response, data: T, message?: string): void {
    this.success(res, data, message, 201);
  }

  /**
   * Send no content response
   */
  static noContent(res: Response): void {
    res.status(204).send();
  }
}
