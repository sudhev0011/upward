import { Response, NextFunction } from "express";
import { IGetProviderDashboardStatsUseCase } from "../../../../domain/interfaces/usecases/provider/dashboard/IGetProviderDashboardStatsUseCase";
import { successResponse } from "../../../../shared/constants";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

export class ProviderDashboardController {
  constructor(
    private readonly getProviderDashboardStatsUseCase: IGetProviderDashboardStatsUseCase,
  ) {}

  getStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const providerId = validateUserId(req);
      const timeframe = String(req.query.timeframe || "monthly");
      const stats = await this.getProviderDashboardStatsUseCase.execute(providerId, timeframe);
      sendSuccessResponse(res, successResponse.GET_DASHBOARD_STATS_SUCCESS, stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
