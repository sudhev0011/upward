import {
  Response,
  NextFunction,
} from "express";

import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";

import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";

import { successResponse } from "../../../../shared/constants";

import { CreatePaymentIntentRequestDtoSchema } from "../../../../application/dtos/client/payment/create-payment-intent-request.dto";

import { ICreatePaymentIntentUseCase } from "../../../../domain/interfaces/usecases/payment/ICreatePaymentIntentUseCase";

export class PaymentController {

  constructor(
    private readonly _createPaymentIntentUseCase: ICreatePaymentIntentUseCase
  ) {}
  /**
   * this created stripe payment intent
   * @param req its the basic info for booking like, providerServiceId, date, startTime, location,clientId,paymentType etc
   * @param res res is clientSecret, paymentIntentId, and paymentId
   * @param next 
   * @returns 
   */
  createPaymentIntent = async (
    req: AuthenticatedRequest,

    res: Response,

    next: NextFunction
  ) => {

    const clientId =
      validateUserId(req);

    const parsed =
      CreatePaymentIntentRequestDtoSchema.safeParse(
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
        await this._createPaymentIntentUseCase.execute(
          clientId,

          parsed.data
        );

      sendSuccessResponse(
        res,

        successResponse.CREATE_PAYMENT_INTENT_SUCCESS,

        result
      );

    } catch (error) {

      handleAsyncError(
        error,

        next
      );
    }
  };
}