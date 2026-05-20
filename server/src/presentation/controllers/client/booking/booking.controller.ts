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

import { CreateBookingRequestDtoSchema } from "../../../../application/dtos/client/booking/create-booking-request.dto";

import { ICreateBookingUseCase } from "../../../../domain/interfaces/usecases/booking/ICreateBookingUseCase";

export class BookingController {
  constructor(
    private readonly _createBookingUseCase: ICreateBookingUseCase
  ) {}

  /**
   * Create booking
   */
  createBooking = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const clientId = validateUserId(req);

    const parsed =
      CreateBookingRequestDtoSchema.safeParse(
        req.body
      );

    if (!parsed.success) {
      return handleValidationError(
        formatZodErrors(parsed.error),
        next
      );
    }

    try {
      const result =
        await this._createBookingUseCase.execute(
          clientId,
          parsed.data
        );

      sendSuccessResponse(
        res,
        successResponse.CREATE_BOOKING_SUCCESS,
        result
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}