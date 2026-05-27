import { Router } from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { subscriptionController } from "../../infrastructure/di/subscriptionDi";

export class SubscriptionRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    // --- Admin Subscription Plan Management ---
    this.router.post(
      "/admin/plans",
      authorizeRoles("admin"),
      subscriptionController.createPlan,
    );
    this.router.patch(
      "/admin/plans/:id",
      authorizeRoles("admin"),
      subscriptionController.updatePlan,
    );
    this.router.delete(
      "/admin/plans/:id",
      authorizeRoles("admin"),
      subscriptionController.deletePlan,
    );
    this.router.get(
      "/admin/plans",
      authorizeRoles("admin"),
      subscriptionController.getAllPlans,
    );

    // --- Provider Subscription Management ---
    this.router.get(
      "/provider/active-plans",
      authorizeRoles("provider"),
      subscriptionController.getActivePlans,
    );
    this.router.post(
      "/provider/checkout",
      authorizeRoles("provider"),
      subscriptionController.createCheckout,
    );
    this.router.get(
      "/provider/my-status",
      authorizeRoles("provider"),
      subscriptionController.getMyStatus,
    );
  }
}
