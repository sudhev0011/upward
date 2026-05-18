import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { successResponse } from "../../../../shared/constants";
import { GetAvailableSlotsRequestDtoSchema } from "../../../../application/dtos/provider/slot/get-available-slots-request.dto";
import { IGetAvailableSlotsUseCase } from "../../../../domain/interfaces/usecases/slot/IGetAvailableSlotsUseCase";

export class SlotController {
  constructor(
    private readonly _getAvailableSlotsUseCase: IGetAvailableSlotsUseCase
  ) {}

  /**
   * Get available slots for a provider service
   */
  getAvailableSlots = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const parsed = GetAvailableSlotsRequestDtoSchema.safeParse({
      providerId: req.params.providerId,
      providerServiceId: req.params.serviceId,
      date: req.query.date,
    });

    if (!parsed.success) {
      return handleValidationError(
        formatZodErrors(parsed.error),
        next
      );
    }

    try {
      const result =
        await this._getAvailableSlotsUseCase.execute(
          parsed.data
        );

      sendSuccessResponse(
        res,
        successResponse.GET_AVAILABLE_SLOTS_SUCCESS,
        result
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}