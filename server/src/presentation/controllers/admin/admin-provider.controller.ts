import { Request, Response, NextFunction } from "express";
import { IGetAllProvidersUseCase } from "../../../domain/interfaces/usecases/admin/provider/IGetAllProvidersUseCase";
import { IAdminGetProviderByIdUseCase } from "../../../domain/interfaces/usecases/admin/provider/IAdminGetProviderByIdUseCase";
import { IApproveProviderUseCase } from "../../../domain/interfaces/usecases/admin/provider/IApproveProviderUseCase";
import { GetProvidersQueryDtoSchema } from "../../../application/dtos/admin/provider/request/get-providers-query.dto";
import { ApproveProviderDtoSchema } from "../../../application/dtos/admin/provider/request/approve-provider-request.dto";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";
import { BlockProviderRequestDtoSchema } from "../../../application/dtos/admin/provider/request/block-provider-request.dto";
import { IBlockProviderUseCase } from "../../../domain/interfaces/usecases/admin/provider/IBlockProviderUseCase";
import { RejectProviderDtoSchema } from "../../../application/dtos/admin/provider/request/reject-provider-request.dto";
import { IRejectProviderUseCase } from "../../../domain/interfaces/usecases/admin/provider/IRejectProviderUseCase";
import { IGetProviderKycUseCase } from "../../../domain/interfaces/usecases/provider/kyc/IGetProviderKycUseCase";
import { IGetProviderBankUseCase } from "../../../domain/interfaces/usecases/provider/kyc/IGetProviderBankUseCase";
import { IApproveProviderBankUseCase } from "../../../domain/interfaces/usecases/admin/provider/IApproveProviderBankUseCase";
import { successResponse } from "../../../shared/constants";

export class AdminProviderController {
  constructor(
    private readonly _getAllProvidersUseCase: IGetAllProvidersUseCase,
    private readonly _getProviderByIdUseCase: IAdminGetProviderByIdUseCase,
    private readonly _approveProviderUseCase: IApproveProviderUseCase,
    private readonly _rejectProviderUseCase: IRejectProviderUseCase,
    private readonly _blockProviderUseCase: IBlockProviderUseCase,
    private readonly _getProviderKycUseCase: IGetProviderKycUseCase,
    private readonly _getProviderBankUseCase: IGetProviderBankUseCase,
    private readonly _approveProviderBankUseCase: IApproveProviderBankUseCase,
  ) {}
  getAllProviders = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = GetProvidersQueryDtoSchema.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllProvidersUseCase.execute(parsed.data);
      sendSuccessResponse(res, successResponse.GET_ALL_PROVIDERS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  getProviderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this._getProviderByIdUseCase.execute(id as string);
      sendSuccessResponse(res, successResponse.GET_PROVIDER, data);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  approveProvider = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = ApproveProviderDtoSchema.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._approveProviderUseCase.execute(parsed.data);
      const message = `Provider ${parsed.data.isApprovedByAdmin ? "approved" : "approval revoked"} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  rejectProvider = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = RejectProviderDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._rejectProviderUseCase.execute(parsed.data);
      const message = `Provider ${parsed.data.isApprovedByAdmin ? "approved" : "approval revoked"} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
  blockProvider = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = BlockProviderRequestDtoSchema.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._blockProviderUseCase.execute(parsed.data);
      const message = `Provider ${parsed.data.isBlocked ? "blocked" : "unblocked"} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getProviderKyc = async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const userId = req.params.userId

        const kycData = await this._getProviderKycUseCase.execute(userId as string);
  
        sendSuccessResponse(res, successResponse.GET_KYC_DATA, kycData);
      } catch (error) {
        handleAsyncError(error, next);
      }
    };

  getProviderBank = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const bankData = await this._getProviderBankUseCase.execute(id as string);
      sendSuccessResponse(res, "Bank details retrieved successfully", bankData);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  approveProviderBank = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await this._approveProviderBankUseCase.execute(id as string);
      sendSuccessResponse(res, "Bank details verified successfully", null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
