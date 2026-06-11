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
import { CreateRemainingPaymentIntentRequestDtoSchema } from "../../../../application/dtos/client/payment/create-remaining-payment-intent-request.dto";

import { ICreatePaymentIntentUseCase } from "../../../../domain/interfaces/usecases/payment/ICreatePaymentIntentUseCase";
import { ICreateRemainingPaymentIntentUseCase } from "../../../../domain/interfaces/usecases/payment/ICreateRemainingPaymentIntentUseCase";

export class PaymentController {
  constructor(
    private readonly _createPaymentIntentUseCase: ICreatePaymentIntentUseCase,
    private readonly _createRemainingPaymentIntentUseCase: ICreateRemainingPaymentIntentUseCase,
  ) {}

  createPaymentIntent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const clientId = validateUserId(req);

    const parsed = CreatePaymentIntentRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createPaymentIntentUseCase.execute(
        clientId,
        parsed.data,
      );

      sendSuccessResponse(
        res,
        successResponse.CREATE_PAYMENT_INTENT_SUCCESS,
        result,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createRemainingPaymentIntent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const clientId = validateUserId(req);

    const parsed = CreateRemainingPaymentIntentRequestDtoSchema.safeParse(
      req.body,
    );

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createRemainingPaymentIntentUseCase.execute(
        clientId,
        parsed.data,
      );

      sendSuccessResponse(
        res,
        successResponse.CREATE_REMAINING_PAYMENT_INTENT_SUCCESS,
        result,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}