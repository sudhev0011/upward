import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { IGetProviderKycUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/IGetProviderKycUseCase";

export class GetProviderKycController {
  constructor(
    private readonly _getProviderKycUseCase: IGetProviderKycUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const kycData = await this._getProviderKycUseCase.execute(providerId);

      sendSuccessResponse(res, "kycData successfully retrived", kycData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
