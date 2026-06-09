import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../../shared/constants";
import { GetClientWalletUseCase } from "../../../../application/use-cases/wallet/get-client-wallet.use-case";

export class WalletController {
  constructor(
    private readonly getClientWalletUseCase: GetClientWalletUseCase
  ) {}

  getWallet = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const clientId = validateUserId(req);

    try {
      const result = await this.getClientWalletUseCase.execute(clientId);

      sendSuccessResponse(
        res,
        successResponse.GET_WALLET_SUCCESS,
        result
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
