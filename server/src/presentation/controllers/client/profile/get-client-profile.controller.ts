import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { IGetClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/IGetClientProfileUseCase";

export class GetClientProfileController {
  constructor(
    private readonly _getClientProfileUseCase: IGetClientProfileUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const profile = await this._getClientProfileUseCase.execute(userId);
      sendSuccessResponse(
        res,
        "Client profile retrieved successfully",
        profile,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
