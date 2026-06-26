import { Response, NextFunction } from "express";
import { IGetClientDashboardStatsUseCase } from "../../../../domain/interfaces/usecases/client/dashboard/IGetClientDashboardStatsUseCase";
import { successResponse } from "../../../../shared/constants";
import {
  handleAsyncError,
  sendSuccessResponse,
  validateUserId,
} from "../../../../shared/utils/presentation/controller.utils";
import { AuthenticatedRequest } from "../../../middleware/auth.middleware";

export class ClientDashboardController {
  constructor(
    private readonly getClientDashboardStatsUseCase: IGetClientDashboardStatsUseCase,
  ) {}

  getStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const clientId = validateUserId(req);
      const timeframe = String(req.query.timeframe || "monthly");
      const stats = await this.getClientDashboardStatsUseCase.execute(clientId, timeframe);
      sendSuccessResponse(res, successResponse.GET_DASHBOARD_STATS_SUCCESS, stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
