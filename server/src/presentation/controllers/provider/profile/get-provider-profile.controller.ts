import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { IGetProviderProfileUseCase } from "../../../../domain/interfaces/usecases/provider/profile/IGetProviderProfileUseCase";

export class GetProviderProfileController {
  constructor(
    private readonly _getProviderProfileUseCase: IGetProviderProfileUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const profile = await this._getProviderProfileUseCase.execute(userId);
      sendSuccessResponse(
        res,
        "provider profile retrieved successfully",
        profile,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
