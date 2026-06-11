import { Request, Response, NextFunction } from "express";

import { handleAsyncError } from "../../../shared/utils/presentation/controller.utils";

import { IPaymentGateway } from "../../../domain/interfaces/services/payment/IPaymentGateway";

import { IConfirmPaymentUseCase } from "../../../domain/interfaces/usecases/payment/IConfirmPaymentUseCase";
import { confirmSubscriptionPaymentUseCase } from "../../../infrastructure/di/subscriptionDi";
import { IConfirmRemainingPaymentUseCase } from "../../../domain/interfaces/usecases/payment/IConfirmRemainingPaymentUseCase";

export class StripeWebhookController {
  constructor(
    private paymentGateway: IPaymentGateway,

    private confirmPaymentUseCase: IConfirmPaymentUseCase,

    private confirmRemainingPaymentUseCase: IConfirmRemainingPaymentUseCase,
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
        if (event.metadata?.type === "subscription") {
          await confirmSubscriptionPaymentUseCase.execute(
            event.paymentIntentId,
          );
        } else if (event.metadata?.type === "remaining") {
          await this.confirmRemainingPaymentUseCase.execute(
            event.paymentIntentId,
          );
        } else {
          await this.confirmPaymentUseCase.execute(event.paymentIntentId);
        }
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
