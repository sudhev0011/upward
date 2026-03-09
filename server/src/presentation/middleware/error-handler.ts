import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../../domain/errors/errors';
import { ZodError } from 'zod';
import { sendInternalServerErrorResponse, sendErrorResponse } from '../../shared/utils/presentation/controller.utils';


export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const err = new ValidationError(first?.message ?? 'Validation error');
    sendErrorResponse(res, err.message, err.statusCode);
    return;
  }
  if (error instanceof AppError) {
    sendErrorResponse(res, error.message, null, error.statusCode);
    return;
  }
  const message = error instanceof Error ? error.message : 'Internal server error';
  sendInternalServerErrorResponse(res, message);
}
