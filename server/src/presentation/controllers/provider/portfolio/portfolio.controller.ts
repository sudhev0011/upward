import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { formatZodErrors } from "../../../../shared/utils/presentation/zod-error-formatter.utils";
import { successResponse } from "../../../../shared/constants";
import { CreatePortfolioItemRequestDtoSchema, GetPortfolioQueryDtoSchema, GetUploadUrlRequestDtoSchema, RemovePortfolioImageRequestDtoSchema, UpdatePortfolioItemRequestDtoSchema } from "../../../../application/dtos/provider/portfolio/portfolioRequest.dto";
import { ICreatePortfolioItemUseCase } from "../../../../domain/interfaces/usecases/portfolio/ICreatePortfolioItemUseCase";
import { IGetPortfolioUseCase } from "../../../../domain/interfaces/usecases/portfolio/IGetPortfolioUseCase";
import { IDeletePortfolioItemUseCase } from "../../../../domain/interfaces/usecases/portfolio/IDeletePortfolioItemUseCase";
import { IGetUploadUrlUseCase } from "../../../../domain/interfaces/usecases/portfolio/IGetUploadUrlUseCase";
import { IUpdatePortfolioItemUseCase } from "../../../../domain/interfaces/usecases/portfolio/IUpdatePortfolioItemUseCase";
import { IRemovePortfolioImageUseCase } from "../../../../domain/interfaces/usecases/portfolio/IRemovePorfolioImageUseCase";

export class PortfolioController {
  constructor(
    private readonly _getUploadUrlUseCase: IGetUploadUrlUseCase,
    private readonly _createPortfolioItemUseCase: ICreatePortfolioItemUseCase,
    private readonly _getPortfolioUseCase: IGetPortfolioUseCase,
    private readonly _updatePortfolioItemUseCase: IUpdatePortfolioItemUseCase,
    private readonly _removePortfolioImageUseCase: IRemovePortfolioImageUseCase,
    private readonly _deletePortfolioItemUseCase: IDeletePortfolioItemUseCase,
  ) {}

  // GET /portfolio/upload-url?fileName=x&contentType=image/jpeg
  // Step 1 — provider requests a presigned S3 URL before uploading
  getUploadUrl = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    const parsed = GetUploadUrlRequestDtoSchema.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getUploadUrlUseCase.execute({
        providerId,
        ...parsed.data,
      });
      sendSuccessResponse(res, successResponse.GET_UPLOAD_URL_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  // POST /portfolio
  // Step 2 — after uploading to S3, provider saves the portfolio item
  createPortfolioItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);

    const bodySchema = CreatePortfolioItemRequestDtoSchema.omit({ providerId: true });
    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._createPortfolioItemUseCase.execute({
        ...parsed.data,
        providerId,
      });
      sendSuccessResponse(res, successResponse.CREATE_PORTFOLIO_ITEM_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  // GET /portfolio
  // Returns all portfolio items for the authenticated provider
  getPortfolio = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);
 
    const parsed = GetPortfolioQueryDtoSchema.safeParse(req.query);
    if (!parsed.success)
      return handleValidationError(formatZodErrors(parsed.error), next);
 
    try {
      const result = await this._getPortfolioUseCase.execute(
        providerId,
        parsed.data.page,
        parsed.data.limit
      );
      sendSuccessResponse(res, successResponse.GET_PORTFOLIO_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  // DELETE /portfolio/:id
  // Deletes item doc from DB and all associated images from S3
  deletePortfolioItem = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const providerId = validateUserId(req);
    const { id } = req.params;

    if(Array.isArray(id)){

        return handleValidationError('invalid id', next)
    }

    try {
      await this._deletePortfolioItemUseCase.execute(id, providerId);
      sendSuccessResponse(res, successResponse.DELETE_PORTFOLIO_ITEM_SUCCESS, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

    // PATCH /portfolio/:id
  // Updates metadata + appends new images
  updatePortfolioItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const providerId = validateUserId(req);
    const { id } = req.params;
 
    const parsed = UpdatePortfolioItemRequestDtoSchema.safeParse(req.body);
    if (!parsed.success) return handleValidationError(formatZodErrors(parsed.error), next);

    if(Array.isArray(id)){
      return handleValidationError("invalid id",next)
    }
 
    try {
      const result = await this._updatePortfolioItemUseCase.execute(id, providerId, parsed.data);
      sendSuccessResponse(res, successResponse.UPDATE_PORTFOLIO_ITEM_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
 
  // DELETE /portfolio/:id/images
  // Removes a single image from item + deletes from S3
  removePortfolioImage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const providerId = validateUserId(req);
    const { id } = req.params;
 
    const parsed = RemovePortfolioImageRequestDtoSchema.safeParse(req.body);
    if (!parsed.success) return handleValidationError(formatZodErrors(parsed.error), next);

    if(Array.isArray(id)){
      return handleValidationError("invalid id", next)
    }
 
    try {
      await this._removePortfolioImageUseCase.execute(id, providerId, parsed.data.imageUrl);
      sendSuccessResponse(res, successResponse.REMOVE_PORTFOLIO_IMAGE_SUCCESS, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}