import { NextFunction, Request, Response } from "express";
import { IAdminGetClientByIdUseCase } from "../../../domain/interfaces/usecases/admin/client/IAdminGetClientByIdUseCase";
import { IBlockClientUseCase } from "../../../domain/interfaces/usecases/admin/client/IBlockUserUseCase";
import { IGetAllClientsUseCase } from "../../../domain/interfaces/usecases/admin/client/IGetAllClientsUseCase";
import { BlockClientRequestDtoSchema } from "../../../application/dtos/admin/user/request/block-client-request.dto";
import { GetClientsQueryDtoSchema } from "../../../application/dtos/admin/user/request/get-clients-query.dto";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../shared/constants";

export class AdminClientController {
  constructor(
    private readonly _getAllClientsUseCase: IGetAllClientsUseCase,
    private readonly _getClientByIdUseCase: IAdminGetClientByIdUseCase,
    private readonly _blockUserUseCase: IBlockClientUseCase,
  ) {}
//get all client for admin
  getAllClients = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = GetClientsQueryDtoSchema.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllClientsUseCase.execute(parsed.data);
      sendSuccessResponse(res, successResponse.GET_ALL_CLIENTS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
//get specific client with clientId
  getClientById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this._getClientByIdUseCase.execute(id as string);
      sendSuccessResponse(res, successResponse.GET_CLIENT, user);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
// block a specific client
  blockClient = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const parsed = BlockClientRequestDtoSchema.safeParse(req.body);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      await this._blockUserUseCase.execute(parsed.data);
      const message = `User ${parsed.data.isBlocked ? "blocked" : "unblocked"} successfully`;
      sendSuccessResponse(res, message, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
