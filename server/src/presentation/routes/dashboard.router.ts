import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { clientDashboardController } from "../../infrastructure/di/clientDi";
import { providerDashboardController } from "../../infrastructure/di/provider.Di";
import { adminDashboardController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class DashboardRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get(
      "/client/stats",
      authorizeRoles(UserRole.CLIENT),
      clientDashboardController.getStats
    );

    this.router.get(
      "/provider/stats",
      authorizeRoles(UserRole.PROVIDER),
      providerDashboardController.getStats
    );

    this.router.get(
      "/admin/stats",
      authorizeRoles(UserRole.ADMIN),
      adminDashboardController.getStats
    );
  }
}