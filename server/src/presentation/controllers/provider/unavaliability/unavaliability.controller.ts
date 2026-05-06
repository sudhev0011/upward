import { Response, NextFunction, Request } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { successResponse } from "../../../../shared/constants";
import { BaseCreateUnavailabilitySchema  } from "../../../../application/dtos/provider/unavailability/unavailability-request.dto";
import { ICreateUnavailabilityUseCase } from "../../../../domain/interfaces/usecases/unavaliability/ICreateUnavaliability.use-case";
import { IGetUnavailabilitiesUseCase } from "../../../../domain/interfaces/usecases/unavaliability/IGetUnavaliability.use-case";
import { IDeleteUnavailabilityUseCase } from "../../../../domain/interfaces/usecases/unavaliability/IDeleteUnavaliability.use-case";

export class UnavailabilityController {
  constructor(
    private readonly _createUnavailabilityUseCase: ICreateUnavailabilityUseCase,
    private readonly _getUnavailabilitiesUseCase: IGetUnavailabilitiesUseCase,
    private readonly _deleteUnavailabilityUseCase: IDeleteUnavailabilityUseCase
  ) {}

  createUnavailability = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    const bodySchema = BaseCreateUnavailabilitySchema.omit({ providerId: true });
    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createUnavailabilityUseCase.execute({
        ...parsed.data,
        providerId,
      });
      sendSuccessResponse(res, successResponse.CREATE_UNAVAILABILITY_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getUnavailabilities = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    try {
      const result = await this._getUnavailabilitiesUseCase.execute(providerId);
      sendSuccessResponse(res, successResponse.GET_UNAVAILABILITIES_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteUnavailability = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params as { id: string };

    if (!id?.trim()) {
      return handleValidationError("Invalid unavailability id", next);
    }

    try {
      await this._deleteUnavailabilityUseCase.execute(id);
      sendSuccessResponse(res, successResponse.DELETE_UNAVAILABILITY_SUCCESS, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}