import { IGetAllCategoriesUseCase } from "../../../domain/interfaces/usecases/admin/category/IGetAllCategoriesUseCase";
import { NextFunction, Request, Response } from "express";
import { handleAsyncError, sendSuccessResponse } from "../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../shared/constants";
export class PublicCategoryController {

    constructor(
        private readonly _getAllCategoriesUseCase: IGetAllCategoriesUseCase
    ){}


    getAllCategories = async (req: Request, res: Response, next: NextFunction)=>{

    try {
        const result = await this._getAllCategoriesUseCase.execute(false);
        sendSuccessResponse(res, successResponse.CATEGORIES_FETCHED_FOR_PUBLIC, result);
    } catch (error) {
        handleAsyncError(error, next);
    }
  }
}