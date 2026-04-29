import { NextFunction, Request, Response } from "express";
import { IGetAllServicesUseCase } from "../../../domain/interfaces/usecases/service/IGetAllServicesUseCase";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";
import { IGetServicesByCategoryUseCase } from "../../../domain/interfaces/usecases/service/IGetServicesByCategoryUseCase";
import { successResponse } from "../../../shared/constants";

export class PublicServiceController {
  constructor(
    private readonly _getAllServicesUseCase: IGetAllServicesUseCase,
    private readonly _getServicesByCategoryUseCase: IGetServicesByCategoryUseCase
  ) {}

  getAllService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await this._getAllServicesUseCase.execute(false);
      sendSuccessResponse(res, successResponse.SERVICES_FETCHED_FOR_PUBLIC, services);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getServicesByCategory = async (req: Request, res: Response, next: NextFunction)=>{
    const {categoryId} = req.params as {categoryId: string};

    if(!categoryId || categoryId.trim().length < 0){
        return handleValidationError("category id required", next);
    }

    try {
      const result = await this._getServicesByCategoryUseCase.execute(categoryId);
      sendSuccessResponse(res, successResponse.SERVICES_FETCHED_BY_CATEGORY_FOR_PUBLIC, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  }
}
