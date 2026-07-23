import {
  AppError,
  ConflictError,
  InternalServerError,
  BadRequestError,
  ValidationError,
} from "../../../domain/errors/errors";

export class ErrorHandler {
  static createValidationError(message: string): ValidationError {
    return new ValidationError(message);
  }

  static handleAsyncError(error: unknown): unknown {
    console.log(typeof error)
    if (error instanceof AppError) {
      return error;
    }

    if (typeof error === "object" && error !== null) {
      const err = error as any;

      if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return new ConflictError(`That ${field} is already in use.`);
      }

      if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
          .map((val: any) => val.message)
          .join(", ");
        return new ValidationError(message);
      }

      if (err.name === "CastError") {
        return new BadRequestError(`Invalid format for field: ${err.path}`);
      }
    }

    if (error instanceof Error) {
      return new InternalServerError(error.message);
    }

    return new InternalServerError("An unexpected server error occurred");
  }
}
