import { NextFunction, Request, Response } from "express";
import { CreateCategoryRequestDtoSchema } from "../../../application/dtos/admin/category/request/create-category-request.dto";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";
import { ICreateCategoryUseCase } from "../../../domain/interfaces/usecases/admin/category/ICreateCategoryUseCase";
import { IGetAllCategoriesUseCase } from "../../../domain/interfaces/usecases/admin/category/IGetAllCategoriesUseCase";
import { IGetAllCategoriesWithPagination } from "../../../domain/interfaces/usecases/admin/category/IGetAllCategoriesWithPaginationUseCase";
import { GetPaginatedCategoriesRequestDto } from "../../../application/dtos/admin/category/request/get-paginated-category-request.dto";
import { IUpdateCategoryUseCase } from "../../../domain/interfaces/usecases/admin/category/IUpdateCategoryUseCase";
import { UpdateCategoryRequestSchema } from "../../../application/dtos/admin/category/request/update-category-request.dto";
import { successResponse } from "../../../shared/constants";

export class AdminCategoryController {
  constructor(
    private readonly _createCategoryUseCase: ICreateCategoryUseCase,
    private readonly _getAllCategoriesUseCase: IGetAllCategoriesUseCase,
    private readonly _getAllCategoriesWithPaginationUseCase: IGetAllCategoriesWithPagination,
    private readonly _updateCategoryUseCase: IUpdateCategoryUseCase,
  ) {}

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = CreateCategoryRequestDtoSchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createCategoryUseCase.execute(parsed.data);
      sendSuccessResponse(res, successResponse.CATEGORY_CREATED, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this._getAllCategoriesUseCase.execute(true);
      sendSuccessResponse(res, successResponse.CATEGORIES_FETCHED, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getAllPaginatedCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const parsed = GetPaginatedCategoriesRequestDto.safeParse(req.query);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getAllCategoriesWithPaginationUseCase.execute(
        parsed.data,
      );

      sendSuccessResponse(res, successResponse.PAGINATED_CATEGORIES_FETCHED, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };


  updateCategory = async(req: Request, res: Response, next: NextFunction)=>{

    const parsed = UpdateCategoryRequestSchema.safeParse(req.body);

    if(!parsed.success){
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._updateCategoryUseCase.execute(parsed.data)
      sendSuccessResponse(res, successResponse.UPDATE_CATEGORY, result);
    } catch (error) {
      handleAsyncError(error, next)
    }
  }


}
