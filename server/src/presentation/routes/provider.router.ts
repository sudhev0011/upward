import { Router } from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import {
  providerProfileController,
  kycController,
  providerServiceController,
  availabilityController,
  unavaliabilityController,
  availabilityOverrideController,
  portfolioController,
  payoutController,
  providerDashboardController,
} from "../../infrastructure/di/provider.Di";
import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
import { UserRole } from "../../domain/enums/user-role.enum";
import { bookingController } from "../../infrastructure/di/clientDi";
export class ProviderRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);

    this.router.use(authenticateToken);
    this.router.use(authorizeRoles("provider"));
    this.router.use(userBlockedMiddleware.checkUserBlocked);

    this.router.get("/dashboard/stats", providerDashboardController.getStats);

    this.router.post(
      "/profile",
      providerProfileController.createProviderProfile,
    );
    this.router.get("/profile", providerProfileController.getProviderProfile);
    this.router.put(
      "/profile",
      providerProfileController.updateProviderProfile,
    );
    this.router.post(
      "/profile-upload-url",
      providerProfileController.uploadAvatar,
    );

    this.router.post("/kyc/identity", kycController.submitProviderKyc);
    this.router.get("/kyc/identity", kycController.getProviderKyc);
    this.router.post("/kyc/bank", kycController.saveProviderBank); // bacnk info saving to db after document upload
    this.router.get("/kyc/bank", kycController.getProviderBank);
    this.router.post("/media/kyc-document", kycController.uploadProviderKyc); // uploading url generating controller

    this.router.post(
      "/providerService",
      providerServiceController.createProviderService,
    );
    this.router.get(
      "/providerServices",
      providerServiceController.getProviderServicesByCategory,
    );
    this.router.patch(
      "/providerService",
      providerServiceController.setProviderServicePrice,
    );
    this.router.delete(
      "/providerService/:id",
      providerServiceController.deleteProviderService,
    );

    this.router.get("/availability", availabilityController.getAvailability);
    this.router.put("/availability", availabilityController.setAvailability);

    // ─── Unavailability ───────────────────────────────────────────────────────
    this.router.get(
      "/unavailability",
      unavaliabilityController.getUnavailabilities,
    );
    this.router.post(
      "/unavailability",
      unavaliabilityController.createUnavailability,
    );
    this.router.delete(
      "/unavailability/:id",
      unavaliabilityController.deleteUnavailability,
    );

    // ─── Availability Overrides ───────────────────────────────────────────────
    this.router.get(
      "/availability/overrides",
      availabilityOverrideController.getAvailabilityOverrides,
    );
    this.router.put(
      "/availability/overrides",
      availabilityOverrideController.setAvailabilityOverride,
    );
    this.router.delete(
      "/availability/overrides/:date",
      availabilityOverrideController.deleteAvailabilityOverride,
    );

    //---Portfolio

    this.router.get("/portfolio/upload-url", portfolioController.getUploadUrl);
    this.router.post("/portfolio", portfolioController.createPortfolioItem);
    this.router.get("/portfolio", portfolioController.getPortfolio);
    this.router.delete(
      "/portfolio/:id",
      portfolioController.deletePortfolioItem,
    );
    this.router.delete(
      "/portfolio/:id/images",
      portfolioController.removePortfolioImage,
    );
    this.router.patch(
      "/portfolio/:id",
      portfolioController.updatePortfolioItem,
    );

    this.router.get(
      "/bookings",
      bookingController.listBookings(UserRole.PROVIDER),
    );
    this.router.patch(
      "/bookings/:id/cancel",
      bookingController.cancelBooking(UserRole.PROVIDER),
    );
    this.router.patch(
      "/bookings/:id/complete",
      bookingController.completeBooking,
    );
    this.router.patch(
      "/bookings/:id/provider-complete",
      bookingController.providerCompleteBooking,
    );
    this.router.get(
      "/payouts",
      payoutController.getPayouts,
    );
  }
}
