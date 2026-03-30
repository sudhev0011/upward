import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { IUploadKycDocumentUseCase } from "../../../../domain/interfaces/usecases/provider/media/IUploadKycDocumentUseCase";
import { UploadDtoSchema } from "../../../../application/dtos/common/media/upload-avatar.dto";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";

export class UploadKycDocumentController {
  constructor(
    private readonly _uploadKycDocumentUseCase: IUploadKycDocumentUseCase,
  ) {}

  execute = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const { fileType } = req.body;

      if (!fileType) {
        return handleValidationError("fileType is required", next);
      }

      const response = await this._uploadKycDocumentUseCase.execute({
        userId,
        fileType,
      });

      sendSuccessResponse(res, "Upload URL generated successfully", response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
