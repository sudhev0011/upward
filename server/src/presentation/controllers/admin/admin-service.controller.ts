import { NextFunction, Request, Response } from "express";
import { ICreateServiceUseCase } from "../../../domain/interfaces/usecases/service/ICreateServiceUseCase";
import { CreateServiceRequestDtoSchema } from "../../../application/dtos/admin/service/request/create-service-request.dto";
import { ValidationError } from "../../../domain/errors/errors";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { IDeleteServiceUseCase } from "../../../domain/interfaces/usecases/service/IDeleteServiceUseCase";
import { IGetAllServicesUseCase } from "../../../domain/interfaces/usecases/service/IGetAllServicesUseCase";
import { IGetAllServicesWithPagination } from "../../../domain/interfaces/usecases/service/IGetAllServicesWithPaginationUseCase";
import { GetPaginatedServicesRequestDto } from "../../../application/dtos/admin/service/request/get-paginated-services-response.dto";
import { IToggleServiceUseCase } from "../../../domain/interfaces/usecases/service/IToggleServiceUseCase";
import { ToggleServiceRequestDtoSchema } from "../../../application/dtos/admin/service/request/toggle-service-request.dto";
import { successResponse } from "../../../shared/constants";

export class AdminServiceController {
  constructor(
    private readonly _createServiceUseCase: ICreateServiceUseCase,
    private readonly _deleteServiceUseCase: IDeleteServiceUseCase,
    private readonly _getAllServicesUseCase: IGetAllServicesUseCase,
    private readonly _getAllServicesWithPagination: IGetAllServicesWithPagination,
    private readonly _toggleServiceUseCase: IToggleServiceUseCase,
  ) {}
// methos to create admin service as a catelog for providers
  createService = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = CreateServiceRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createServiceUseCase.execute(parsed.data);
      sendSuccessResponse(res, successResponse.CREATE_SERVICE, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
//delet services created by admin 
  deleteService = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const { serviceId } = req.params as { serviceId: string };
    const userId = validateUserId(req);

    if (!serviceId || serviceId.trim().length === 0) {
      return handleValidationError("service id required", next);
    }

    try {
      await this._deleteServiceUseCase.execute({ serviceId, userId });
      sendSuccessResponse(res, successResponse.DELETE_SERVICE, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
// to fetch all the service created by admin 
  getAllService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await this._getAllServicesUseCase.execute(true);
      sendSuccessResponse(res, successResponse.GET_ALL_SERVICES, services);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
// get all service with pagination data for listing
  getAllServicesWithPagination = async(req: Request, res: Response, next: NextFunction)=>{

    const parsed = GetPaginatedServicesRequestDto.safeParse(req.query);

    if(!parsed.success){
      return handleValidationError(formatZodErrors(parsed.error),next);
    }

    try {
      const result = await this._getAllServicesWithPagination.execute(parsed.data);
      sendSuccessResponse(res, successResponse.PAGINATED_SERVICE_FETCHED, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  }
// toggle the service's isActive property
  toggleService = async(req: Request, res: Response, next: NextFunction)=>{
    const parsed = ToggleServiceRequestDtoSchema.safeParse(req.body);

    if(!parsed.success){
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._toggleServiceUseCase.execute(parsed.data);
      sendSuccessResponse(res,successResponse.SERVICE_TOGGLE_UPDATE, result);

    } catch (error) {
      handleAsyncError(error, next);
    }
  }

}
