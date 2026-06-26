import { NextFunction, Request, Response } from "express";
import { IGetAdminPaymentsUseCase } from "../../../domain/interfaces/usecases/admin/payments/IGetAdminPaymentsUseCase";
import {
  handleAsyncError,
  sendSuccessResponse,
} from "../../../shared/utils/presentation/controller.utils";

export class AdminPaymentController {
  constructor(
    private readonly getAdminPaymentsUseCase: IGetAdminPaymentsUseCase,
  ) {}

  getPayments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string | undefined;
      const transactionStatus = req.query.transactionStatus as string | undefined;

      const result = await this.getAdminPaymentsUseCase.execute({
        page,
        limit,
        search,
        transactionStatus,
      });

      sendSuccessResponse(res, "Payments retrieved successfully", result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
