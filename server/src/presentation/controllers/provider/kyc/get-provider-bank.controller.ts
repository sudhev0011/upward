import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { IGetProviderBankUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/IGetProviderBankUseCase";

export class GetProviderBankController {
  constructor(
    private readonly _getProviderBankUseCase: IGetProviderBankUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const kycData = await this._getProviderBankUseCase.execute(providerId);

      sendSuccessResponse(res, "Bank data successfully retrived", kycData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
