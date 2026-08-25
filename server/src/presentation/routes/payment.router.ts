import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { paymentController } from "../../infrastructure/di/clientDi";
import { adminPaymentController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class PaymentRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    // ─── ADMIN ROUTES ────────────────────────────────────────────
    this.router.get("/", authorizeRoles(UserRole.ADMIN), adminPaymentController.getPayments);

    // ─── CLIENT PAYMENT INTENTS ──────────────────────────────────
    this.router.post(
      "/create-intent",
      authorizeRoles(UserRole.CLIENT),
      paymentController.createPaymentIntent
    );

    this.router.post(
      "/remaining-intent",
      authorizeRoles(UserRole.CLIENT),
      paymentController.createRemainingPaymentIntent
    );
  }
}