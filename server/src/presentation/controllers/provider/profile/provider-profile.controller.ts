import { Request, Response, NextFunction } from "express";
import { IUploadAvatarUseCase } from "../../../../domain/interfaces/usecases/provider/media/IUploadAvatarUseCase";
import { UploadDtoSchema } from "../../../../application/dtos/common/media/upload-avatar.dto";
import {
  handleAsyncError,
  handleValidationError,
  sendCreatedResponse,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { ICreateProviderProfileUseCase } from "../../../../domain/interfaces/usecases/provider/profile/ICreateProviderProfileUseCase";
import { CreateProviderProfileRequestDtoSchema } from "../../../../application/dtos/provider/profile/info/request/create-provider-profile-request.dto";
import { IGetProviderProfileUseCase } from "../../../../domain/interfaces/usecases/provider/profile/IGetProviderProfileUseCase";
import { UpdateProviderProfileRequestDtoSchema } from "../../../../application/dtos/provider/profile/info/request/update-provider-profile-request.dto";
import { IUpdateProviderProfileUseCase } from "../../../../domain/interfaces/usecases/provider/profile/IUpdateProviderProfileUseCase";

export class ProviderProfileController {
  constructor(
    private readonly _uploadAvatarUseCase: IUploadAvatarUseCase,
    private readonly _createProviderProfileUseCase: ICreateProviderProfileUseCase,
    private readonly _getProviderProfileUseCase: IGetProviderProfileUseCase,
    private readonly _updateProviderProfileUseCase: IUpdateProviderProfileUseCase,
  ) {}

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

      const parsed = UploadDtoSchema.safeParse({ userId, fileType });

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const result = await this._uploadAvatarUseCase.execute(parsed.data);

      res.status(200).json({
        success: true,
        message: "Upload URL generated successfully",
        data: result,
      });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  public createProviderProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = CreateProviderProfileRequestDtoSchema.omit({
        userId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._createProviderProfileUseCase.execute({
        ...parsed.data,
        userId,
      });

      sendCreatedResponse(
        res,
        "provider profile created successfully",
        profile,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  public getProviderProfile = async (
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

  public updateProviderProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = UpdateProviderProfileRequestDtoSchema.omit({
        userId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._updateProviderProfileUseCase.execute({
        ...parsed.data,
        userId,
      });

      sendSuccessResponse(res, "Seeker profile updated successfully", profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
