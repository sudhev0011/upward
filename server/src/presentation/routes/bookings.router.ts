import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
import { bookingController } from "../../infrastructure/di/clientDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class BookingRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);

    this.router.use(authenticateToken);

    // ─── SHARED BOOKING ACTIONS ──────────────────────────────────
    // Controller detects role dynamically from req.user
    this.router.get(
      "/",
      authorizeRoles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN),
      bookingController.listBookings
    );

    this.router.patch(
      "/:id/cancel",
      authorizeRoles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN),
      bookingController.cancelBooking
    );

    // ─── CLIENT SPECIFIC ACTIONS ─────────────────────────────────
    this.router.post(
      "/onsite",
      authorizeRoles(UserRole.CLIENT),
      bookingController.createBooking
    );

    this.router.post(
      "/offsite",
      authorizeRoles(UserRole.CLIENT),
      bookingController.createOffsiteBooking
    );

    this.router.patch(
      "/:id/client-complete",
      authorizeRoles(UserRole.CLIENT),
      bookingController.clientCompleteBooking
    );

    this.router.patch(
      "/:id/reschedule/onsite",
      authorizeRoles(UserRole.CLIENT),
      bookingController.rescheduleOnsiteBooking
    );

    this.router.patch(
      "/:id/reschedule/offsite",
      authorizeRoles(UserRole.CLIENT),
      bookingController.rescheduleOffsiteBooking
    );

    // ─── PROVIDER SPECIFIC ACTIONS ───────────────────────────────
    this.router.patch(
      "/:id/complete",
      authorizeRoles(UserRole.PROVIDER),
      userBlockedMiddleware.checkUserBlocked,
      bookingController.completeBooking
    );

    this.router.patch(
      "/:id/provider-complete",
      authorizeRoles(UserRole.PROVIDER),
      userBlockedMiddleware.checkUserBlocked,
      bookingController.providerCompleteBooking
    );
  }
}