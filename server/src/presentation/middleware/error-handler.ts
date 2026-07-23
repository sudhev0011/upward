import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../../domain/errors/errors";
import { ZodError } from "zod";
import {
  sendInternalServerErrorResponse,
  sendErrorResponse,
} from "../../shared/utils/presentation/controller.utils";
import { winstonLogger } from "../../infrastructure/config/logger";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  };

  if (error instanceof ZodError) {
    console.log('caught at error handler')
    const first = error.issues[0];
    console.log(first)
    const validationError = new ValidationError(
      first?.message ?? "Validation error",
    );

    winstonLogger.error(validationError.message, {
      error: validationError,
      ...requestContext,
    });

    sendErrorResponse(res, validationError.message, validationError.statusCode);
    return;
  }

  if (error instanceof AppError) {
    winstonLogger.error(error.message, { error, ...requestContext });

    sendErrorResponse(res, error.message, null, error.statusCode);
    return;
  }

  const nativeError = error instanceof Error ? error : new Error(String(error));
  winstonLogger.error(nativeError.message, {
    error: nativeError,
    ...requestContext,
  });

  sendInternalServerErrorResponse(res, nativeError.message);
}
