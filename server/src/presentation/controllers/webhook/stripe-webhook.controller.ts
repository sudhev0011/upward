import { Request, Response, NextFunction } from "express";

import { handleAsyncError } from "../../../shared/utils/presentation/controller.utils";

import { IPaymentGateway } from "../../../domain/interfaces/services/payment/IPaymentGateway";

import { IConfirmPaymentUseCase } from "../../../domain/interfaces/usecases/payment/IConfirmPaymentUseCase";

export class StripeWebhookController {
  constructor(
    private paymentGateway: IPaymentGateway,

    private confirmPaymentUseCase: IConfirmPaymentUseCase,
  ) {}

  handleWebhook = async (
    req: Request,

    res: Response,

    next: NextFunction,
  ) => {
    try {
      const signature = req.headers["stripe-signature"] as string;

      const event = this.paymentGateway.verifyWebhookEvent(
        signature,

        req.body,
      );

      if (event.type === "payment_intent.succeeded") {
        await this.confirmPaymentUseCase.execute(event.paymentIntentId);
      }

      return res.status(200).json({
        received: true,
      });
    } catch (error) {
      handleAsyncError(
        error,

        next,
      );
    }
  };
}
