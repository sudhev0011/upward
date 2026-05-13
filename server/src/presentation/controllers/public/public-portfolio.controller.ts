import { NextFunction, Request, Response } from "express";
import { GetPortfolioQueryDtoSchema } from "../../../application/dtos/provider/portfolio/portfolioRequest.dto";
import { formatZodErrors } from "../../../shared/utils/presentation/zod-error-formatter.utils";
import {
  handleAsyncError,
  handleValidationError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../shared/constants";
import { IGetPortfolioUseCase } from "../../../domain/interfaces/usecases/portfolio/IGetPortfolioUseCase";

export class PublicPortfolioController {
  constructor(public readonly _getPortfolioUseCase: IGetPortfolioUseCase) {}
    /**
     * this method is to give all the portfolios of the provider for clients to see
     * @param req request includes the id of the provider
     * @param res response is the whole portfolios of the provider
     * @param next 
     * @returns 
     */
  getPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    const { providerId } = req.params;
    if (!providerId) {
      return handleValidationError("ProviderId is required", next);
    }
    if (typeof providerId !== "string") {
      return handleValidationError("invalid providerId", next);
    }
    const parsed = GetPortfolioQueryDtoSchema.safeParse(req.query);
    if (!parsed.success) {
      return handleValidationError(formatZodErrors(parsed.error), next);
    }

    try {
      const result = await this._getPortfolioUseCase.execute(
        providerId,
        parsed.data.page,
        parsed.data.limit,
      );
      sendSuccessResponse(res, successResponse.GET_PORTFOLIO_SUCCESS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
