import { Request, Response, NextFunction } from "express";
import { IGetAdminDashboardStatsUseCase } from "../../../../domain/interfaces/usecases/admin/dashboard/IGetAdminDashboardStatsUseCase";
import { successResponse } from "../../../../shared/constants";
import {
  handleAsyncError,
  sendSuccessResponse,
} from "../../../../shared/utils/presentation/controller.utils";

export class AdminDashboardController {
  constructor(
    private readonly getAdminDashboardStatsUseCase: IGetAdminDashboardStatsUseCase,
  ) {}

  getStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const timeframe = String(req.query.timeframe || "monthly");
      const stats = await this.getAdminDashboardStatsUseCase.execute(timeframe);
      sendSuccessResponse(res, successResponse.GET_DASHBOARD_STATS_SUCCESS, stats);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
