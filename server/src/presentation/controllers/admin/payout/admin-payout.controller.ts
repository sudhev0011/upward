import { Request, Response, NextFunction } from "express";
import {
  handleAsyncError,
  sendSuccessResponse,
} from "../../../../shared/utils/presentation/controller.utils";
import { successResponse } from "../../../../shared/constants";
import { IGetAdminPayoutRequestsUseCase } from "../../../../domain/interfaces/usecases/admin/payout/IGetAdminPayoutRequestsUseCase";
import { IProcessPayoutRequestUseCase } from "../../../../domain/interfaces/usecases/admin/payout/IProcessPayoutRequestUseCase";

export class AdminPayoutController {
  constructor(
    private readonly getAdminPayoutRequestsUseCase: IGetAdminPayoutRequestsUseCase,
    private readonly processPayoutRequestUseCase: IProcessPayoutRequestUseCase
  ) {}

  getPayoutRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await this.getAdminPayoutRequestsUseCase.execute({
        page,
        limit,
        status,
        search,
      });

      sendSuccessResponse(
        res,
        successResponse.GET_PAYOUT_REQUESTS_SUCCESS,
        result
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  processPayoutRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    try {
      await this.processPayoutRequestUseCase.execute(
        id as string,
        status as "transferred" | "rejected",
        adminNotes as string | undefined
      );

      sendSuccessResponse(
        res,
        successResponse.PROCESS_PAYOUT_REQUEST_SUCCESS,
        null
      );
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
