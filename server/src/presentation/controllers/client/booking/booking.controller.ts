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

import { CreateBookingRequestDtoSchema } from "../../../../application/dtos/client/booking/request/create-booking-request.dto";

import { ICreateBookingUseCase } from "../../../../domain/interfaces/usecases/booking/ICreateBookingUseCase";

import { UserRole } from "../../../../domain/enums/user-role.enum";
import { IListBookingsUseCase } from "../../../../domain/interfaces/usecases/booking/IListBookingUseCase";
import { ListBookingsRequestDtoSchema } from "../../../../application/dtos/client/booking/request/list-bookings-request.dto";
import { CancelBookingUseCase } from "../../../../application/use-cases/booking/cancel-booking.use-case";
import { CancelBookingRequestDtoSchema } from "../../../../application/dtos/booking/cancel-booking-request.dto";
import { ICreateOffsiteBookingUseCase } from "../../../../domain/interfaces/usecases/booking/ICreateOffsiteBookingUseCase";
import { CreateOffsiteBookingRequestDtoSchema } from "../../../../application/dtos/client/booking/request/Create-offsite-booking-request.dto";

export class BookingController {
  constructor(
    private readonly _createBookingUseCase: ICreateBookingUseCase,

    private readonly _listBookingsUseCase: IListBookingsUseCase,

    private readonly _cancelBookingUseCase: CancelBookingUseCase,

    private readonly _createOffsiteBookingUseCase: ICreateOffsiteBookingUseCase,
  ) {}

  /**
   * this method is to make booking of a service, it creates the booking doc with info after validation
   * @param req req includes the providerServiceId, date, start time, payment type etc
   * @param res response is a full booking oject with status as pending
   * @param next
   * @returns
   */
  createBooking = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const clientId = validateUserId(req);

    const parsed = CreateBookingRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createBookingUseCase.execute(
        clientId,
        parsed.data,
      );

      sendSuccessResponse(res, successResponse.CREATE_BOOKING_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createOffsiteBooking = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {

    const clientId = validateUserId(req);

    const parsed = CreateOffsiteBookingRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createOffsiteBookingUseCase.execute(
        clientId,
        parsed.data,
      );

      sendSuccessResponse(res, successResponse.CREATE_BOOKING_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  listBookings =
    (role: UserRole) =>
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const currentUserId = validateUserId(req);

      const parsed = ListBookingsRequestDtoSchema.safeParse(req.query);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      try {
        const result = await this._listBookingsUseCase.execute(
          parsed.data,
          currentUserId,
          role,
        );

        sendSuccessResponse(res, successResponse.GET_BOOKINGS_SUCCESS, result);
      } catch (error) {
        handleAsyncError(error, next);
      }
    };

  cancelBooking =
    (role: UserRole) =>
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userId = validateUserId(req);
      const bookingId = req.params.id as string;

      const parsed = CancelBookingRequestDtoSchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      try {
        await this._cancelBookingUseCase.execute({
          bookingId,
          userId,
          role,
          reason: parsed.data.reason ?? null,
        });

        sendSuccessResponse(res, successResponse.CANCEL_BOOKING_SUCCESS, null);
      } catch (error) {
        handleAsyncError(error, next);
      }
    };
}
