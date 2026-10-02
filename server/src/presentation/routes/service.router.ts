import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { adminServiceController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class ServiceRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    // ─── READ (Accessible to Authenticated Users) ────────────────
    this.router.get("/", adminServiceController.getAllServicesWithPagination);
    this.router.get("/all", adminServiceController.getAllService);

    // ─── ADMIN MANAGEMENT ────────────────────────────────────────
    this.router.post("/", authorizeRoles(UserRole.ADMIN), adminServiceController.createService);
    this.router.patch("/:serviceId", authorizeRoles(UserRole.ADMIN), adminServiceController.updateService);
    this.router.patch("/:serviceId/toggle", authorizeRoles(UserRole.ADMIN), adminServiceController.toggleService);
    this.router.delete("/:serviceId", authorizeRoles(UserRole.ADMIN), adminServiceController.deleteService);
  }
}