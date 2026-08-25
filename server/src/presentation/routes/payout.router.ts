import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
import { payoutController } from "../../infrastructure/di/provider.Di";
import { adminPayoutController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class PayoutRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);
    const providerOnly = [
      authorizeRoles(UserRole.PROVIDER),
      userBlockedMiddleware.checkUserBlocked,
    ];
    const adminOnly = [authorizeRoles(UserRole.ADMIN)];

    this.router.use(authenticateToken);

    // ─── PROVIDER ACTIONS ────────────────────────────────────────
    this.router.get("/", providerOnly, payoutController.getPayouts);
    this.router.post("/requests", providerOnly, payoutController.createPayoutRequest);
    this.router.get("/requests", providerOnly, payoutController.getPayoutRequests);

    // ─── ADMIN ACTIONS ───────────────────────────────────────────
    this.router.get("/admin/requests", adminOnly, adminPayoutController.getPayoutRequests);
    this.router.put("/requests/:id", adminOnly, adminPayoutController.processPayoutRequest);
  }
}