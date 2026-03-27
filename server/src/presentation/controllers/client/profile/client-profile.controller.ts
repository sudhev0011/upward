import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { handleAsyncError, sendSuccessResponse, validateUserId } from "../../../../shared/utils/presentation/controller.utils";
import { IUploadAvatarUseCase } from "../../../../domain/interfaces/usecases/client/media/IUploadAvatarUseCase";

export class ClientProfileController {
  constructor(private readonly _uploadAvatarUseCase: IUploadAvatarUseCase) {}

  uploadAvatar = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const {fileType} = req.body;

      const url = await this._uploadAvatarUseCase.execute({
        userId,
        fileType
      });

      sendSuccessResponse(res, "upload url sent successfully", url);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
