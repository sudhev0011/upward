import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendCreatedResponse,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { IUploadAvatarUseCase } from "../../../../domain/interfaces/usecases/client/media/IUploadAvatarUseCase";
import { UploadDtoSchema } from "../../../../application/dtos/common/media/upload-avatar.dto";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { ICreateClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/ICreateClientProfileUseCase";
import { CreateClientProfileRequestDtoSchema } from "../../../../application/dtos/client/profile/info/request/create-client-profile-request.dto";
import { IGetClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/IGetClientProfileUseCase";
import { UpdateClientProfileRequestDtoSchema } from "../../../../application/dtos/client/profile/info/request/update-client-profile-request.dto";
import { IUpdateClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/IUpdateClientProfileUseCase";
import { successResponse } from "../../../../shared/constants";

export class ClientProfileController {
  constructor(
    private readonly _uploadAvatarUseCase: IUploadAvatarUseCase,
    private readonly _createClientProfileUseCase: ICreateClientProfileUseCase,
    private readonly _getClientProfileUseCase: IGetClientProfileUseCase,
    private readonly _updateClientProfileUseCase: IUpdateClientProfileUseCase
  ) {}
  // This method creates a presigned url to upload the image from frontend itself
  uploadAvatar = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      if (!userId) {
        throw new Error(
          "User ID is required but was not found on the request.",
        );
      }
      const { fileType } = req.body;

      const parsed = UploadDtoSchema.safeParse({ fileType, userId });

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const url = await this._uploadAvatarUseCase.execute({
        userId,
        fileType,
      });

      sendSuccessResponse(res, successResponse.UPLOAD_URL_CREATED_SUCCESS, url);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  // This method is used to create the profile of the client
  createClientProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = CreateClientProfileRequestDtoSchema.omit({
        userId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._createClientProfileUseCase.execute({
        ...parsed.data,
        userId,
      });

      sendCreatedResponse(res, successResponse.CLIENT_PROFILE_CREATED_SUCCESS, profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  // This method fetches the profile of the client
  getClientProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const profile = await this._getClientProfileUseCase.execute(userId);
      sendSuccessResponse(
        res,
        successResponse.GET_CLIENT_PROFILE_SUCCESS,
        profile,
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  // This method is used to update the contents of the client profile
  updateClientProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userId = validateUserId(req);
  
        const bodySchema = UpdateClientProfileRequestDtoSchema.omit({ userId: true });
        const parsed = bodySchema.safeParse(req.body);
  
        if (!parsed.success) {
          return handleValidationError(formatZodErrors(parsed.error), next);
        }
  
        const profile = await this._updateClientProfileUseCase.execute({ ...parsed.data, userId });
  
        sendSuccessResponse(res, successResponse.UPDATE_CLIENT_PROFILE_SUCCESS, profile);
      } catch (error) {
        handleAsyncError(error, next);
      }
    };
}
