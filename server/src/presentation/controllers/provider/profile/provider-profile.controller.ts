import { Request, Response, NextFunction } from "express";
import { IUploadAvatarUseCase } from "../../../../domain/interfaces/usecases/provider/media/IUploadAvatarUseCase";
import { UploadDtoSchema } from "../../../../application/dtos/common/media/upload-avatar.dto";
import {
  handleAsyncError,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

export class ProviderProfileController {
  constructor(private readonly _uploadAvatarUseCase: IUploadAvatarUseCase) {}

  public uploadAvatar = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { fileType } = req.body;
      const userId = validateUserId(req);

      if (!userId) {
        throw new Error(
          "User ID is required but was not found on the request.",
        );
      }

      const dto = UploadDtoSchema.parse({ userId, fileType });
      const result = await this._uploadAvatarUseCase.execute(dto);

      res.status(200).json({
        success: true,
        message: "Upload URL generated successfully",
        data: result,
      });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
