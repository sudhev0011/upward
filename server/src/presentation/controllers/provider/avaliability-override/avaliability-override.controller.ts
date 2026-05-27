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
import { SetAvailabilityOverrideRequestDtoSchema } from "../../../../application/dtos/provider/availability-override/availability-override-request.dto";
import { ISetAvailabilityOverrideUseCase } from "../../../../domain/interfaces/usecases/avaliability-override/ISetAvaliabilityOverrideUseCase";
import { IGetAvailabilityOverridesUseCase } from "../../../../domain/interfaces/usecases/avaliability-override/IGetAvaliabilityOverrideUseCase";
import { IDeleteAvailabilityOverrideUseCase } from "../../../../domain/interfaces/usecases/avaliability-override/IDeleteAvaliabilityOverrideUseCase";
import { DateRangeQuerySchema } from "../../../../application/dtos/provider/availability-override/date-range-query.schema";


export class AvailabilityOverrideController {
  constructor(
    private readonly _setAvailabilityOverrideUseCase: ISetAvailabilityOverrideUseCase,
    private readonly _getAvailabilityOverridesUseCase: IGetAvailabilityOverridesUseCase,
    private readonly _deleteAvailabilityOverrideUseCase: IDeleteAvailabilityOverrideUseCase
  ) {}
// this method is to create an override over the normal availability schedule
  setAvailabilityOverride = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    const parsed = SetAvailabilityOverrideRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._setAvailabilityOverrideUseCase.execute({
        ...parsed.data,
        providerId,
      });
      sendSuccessResponse(res, successResponse.SET_AVAILABILITY_OVERRIDE_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAvailabilityOverrides = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    const parsed = DateRangeQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAvailabilityOverridesUseCase.execute(
        providerId,
        parsed.data.startDate,
        parsed.data.endDate
      );
      sendSuccessResponse(res, successResponse.GET_AVAILABILITY_OVERRIDES_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteAvailabilityOverride = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    // date comes from route param: DELETE /availability/overrides/:date
    const { date } = req.params as { date: string };

    if (!date || !date?.trim()) {
      return handleValidationError("Invalid date param", next);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return handleValidationError("Invalid date format, use YYYY-MM-DD", next);
    }

    try {
      await this._deleteAvailabilityOverrideUseCase.execute(providerId, date);
      sendSuccessResponse(res, successResponse.DELETE_AVAILABILITY_OVERRIDE_SUCCESS, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}