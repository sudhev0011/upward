import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { successResponse } from "../../../../shared/constants";
import { SetAvailabilityRequestDtoSchema } from "../../../../application/dtos/provider/availability/availability-request.dto";
import { ISetAvailabilityUseCase } from "../../../../domain/interfaces/usecases/avaliability/ISetAvaliabilityUseCase";
import { IGetAvailabilityUseCase } from "../../../../domain/interfaces/usecases/avaliability/IGetAvaliabilityUseCase";

export class AvailabilityController {
  constructor(
    private readonly _setAvailabilityUseCase: ISetAvailabilityUseCase,
    private readonly _getAvailabilityUseCase: IGetAvailabilityUseCase
  ) {}
// this method is for creating the availability of the provider 
  setAvailability = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    // providerId comes from auth token, not body
    const bodySchema = SetAvailabilityRequestDtoSchema.omit({ providerId: true });
    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._setAvailabilityUseCase.execute({
        ...parsed.data,
        providerId,
      });
      sendSuccessResponse(res, successResponse.SET_AVAILABILITY_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
// to get the saved schedule availability of the provider
  getAvailability = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    try {
      const result = await this._getAvailabilityUseCase.execute(providerId);
      sendSuccessResponse(res, successResponse.GET_AVAILABILITY_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}