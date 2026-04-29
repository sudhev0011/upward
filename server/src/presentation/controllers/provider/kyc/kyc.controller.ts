import { NextFunction, Response } from "express";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { SubmitProviderKycRequestDtoSchema } from "../../../../application/dtos/provider/kyc/submit-provider-kyc.dto";
import { ISubmitProviderKycUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/ISubmitProviderKycUseCase";
import { SaveProviderBankRequestDtoSchema } from "../../../../application/dtos/provider/kyc/save-provider-bank.dto";
import { ISaveProviderBankUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/ISaveProviderBankUseCase";
import { IGetProviderKycUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/IGetProviderKycUseCase";
import { IGetProviderBankUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/IGetProviderBankUseCase";
import { IUploadKycDocumentUseCase } from "../../../../domain/interfaces/usecases/provider/media/IUploadKycDocumentUseCase";
import { successResponse } from "../../../../shared/constants";

export class KycController {
  constructor(
    private readonly _submitProviderKycUseCase: ISubmitProviderKycUseCase,
    private readonly _saveProviderBankUseCase: ISaveProviderBankUseCase,
    private readonly _getProviderKycUseCase: IGetProviderKycUseCase,
    private readonly _getProviderBankUseCase: IGetProviderBankUseCase,
    private readonly _uploadKycDocumentUseCase: IUploadKycDocumentUseCase,
  ) {}

  public submitProviderKyc = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const bodySchema = SubmitProviderKycRequestDtoSchema.omit({
        providerId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      await this._submitProviderKycUseCase.execute({
        ...parsed.data,
        providerId,
      });

      sendSuccessResponse(res, successResponse.KYC_DETAILS_SUBMIT_SUCCESS, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  public saveProviderBank = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);

      const bodySchema = SaveProviderBankRequestDtoSchema.omit({
        providerId: true,
      });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const response = await this._saveProviderBankUseCase.execute({
        ...parsed.data,
        providerId,
      });

      sendSuccessResponse(res, successResponse.BANK_DETAILS_UPLOAD_SUCCESS, response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  public getProviderKyc = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const kycData = await this._getProviderKycUseCase.execute(providerId);

      sendSuccessResponse(res, successResponse.GET_KYC_SUCCESS, kycData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  public getProviderBank = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const kycData = await this._getProviderBankUseCase.execute(providerId);

      sendSuccessResponse(res, successResponse.GET_BANK_SUCCESS, kycData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  public uploadProviderKyc = async (
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

      sendSuccessResponse(res, successResponse.UPLOAD_KYC_URL_SUCCESS, response);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
