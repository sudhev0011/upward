import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../../shared/constants";
import { IGetProviderPayoutsUseCase } from "../../../../domain/interfaces/usecases/provider/payout/IGetProviderPayoutsUseCase";
import { ICreatePayoutRequestUseCase } from "../../../../domain/interfaces/usecases/provider/payout/ICreatePayoutRequestUseCase";
import { IGetProviderPayoutRequestsUseCase } from "../../../../domain/interfaces/usecases/provider/payout/IGetProviderPayoutRequestsUseCase";

export class PayoutController {
  constructor(
    private readonly getProviderPayoutsUseCase: IGetProviderPayoutsUseCase,
    private readonly createPayoutRequestUseCase: ICreatePayoutRequestUseCase,
    private readonly getProviderPayoutRequestsUseCase: IGetProviderPayoutRequestsUseCase
  ) {}

  getPayouts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const providerId = validateUserId(req);

    try {
      const result = await this.getProviderPayoutsUseCase.execute(providerId);

      sendSuccessResponse(
        res,
        successResponse.GET_PAYOUTS_SUCCESS,
        result
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  createPayoutRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const providerId = validateUserId(req);
    const { amount } = req.body;

    try {
      const numericAmount = Number(amount);
      await this.createPayoutRequestUseCase.execute(providerId, numericAmount);

      sendSuccessResponse(
        res,
        successResponse.CREATE_PAYOUT_REQUEST_SUCCESS,
        null
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getPayoutRequests = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const providerId = validateUserId(req);

    try {
      const result = await this.getProviderPayoutRequestsUseCase.execute(providerId);

      sendSuccessResponse(
        res,
        successResponse.GET_PAYOUT_REQUESTS_SUCCESS,
        result
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
