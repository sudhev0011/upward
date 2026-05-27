import express from "express";
import { stripeWebhookController } from "../../infrastructure/di/paymentDi";

export class WebhookRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/stripe",

      express.raw({
        type: "application/json",
      }),

      stripeWebhookController.handleWebhook,
    );
  }
}
