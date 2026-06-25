import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../../shared/constants";
import { IGetProviderPayoutsUseCase } from "../../../../domain/interfaces/usecases/provider/payout/IGetProviderPayoutsUseCase";

export class PayoutController {
  constructor(
    private readonly getProviderPayoutsUseCase: IGetProviderPayoutsUseCase
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
}
