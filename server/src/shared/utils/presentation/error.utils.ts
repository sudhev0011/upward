import { 
  AppError, 
  ConflictError, 
  InternalServerError, 
  BadRequestError, 
  ValidationError 
} from "../../../domain/errors/errors";

export class ErrorHandler {
  static createValidationError(message: string): ValidationError {
    return new ValidationError(message);
  }

  static handleAsyncError(error: unknown): unknown {
    if (error instanceof AppError || (error && (error as any).name === 'ZodError')) {
      return error;
    }

    if (typeof error === 'object' && error !== null) {
      const err = error as any;

      if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return new ConflictError(`That ${field} is already in use.`);
      }

      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        return new ValidationError(message);
      }

      if (err.name === 'CastError') {
        return new BadRequestError(`Invalid format for field: ${err.path}`);
      }
    }

    if (error instanceof Error) {
      return new InternalServerError(error.message);
    }
    
    return new InternalServerError('An unexpected server error occurred');
  }
}