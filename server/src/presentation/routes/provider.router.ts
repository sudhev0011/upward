// import { Router } from "express";
// import {
//   authenticateToken,
//   authorizeRoles,
// } from "../middleware/auth.middleware";
// import {
//   providerProfileController,
//   kycController,
//   providerServiceController,
//   availabilityController,
//   unavaliabilityController,
//   availabilityOverrideController,
//   portfolioController,
//   payoutController,
//   providerDashboardController,
// } from "../../infrastructure/di/provider.Di";
// import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
// import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
// import { UserRole } from "../../domain/enums/user-role.enum";
// import { bookingController } from "../../infrastructure/di/clientDi";
// export class ProviderRouter {
//   public router: Router;

//   constructor() {
//     this.router = Router();
//     this._initializeRoutes();
//   }

//   private _initializeRoutes(): void {
//     const userBlockedMiddleware = new UserBlockedMiddleware(getUserByIdUseCase);

//     this.router.use(authenticateToken);
//     this.router.use(authorizeRoles("provider"));
//     this.router.use(userBlockedMiddleware.checkUserBlocked);

//     this.router.get("/dashboard/stats", providerDashboardController.getStats);

//     this.router.post(
//       "/profile",
//       providerProfileController.createProviderProfile,
//     );
//     this.router.get("/profile", providerProfileController.getProviderProfile);
//     this.router.put(
//       "/profile",
//       providerProfileController.updateProviderProfile,
//     );
//     this.router.post(
//       "/profile-upload-url",
//       providerProfileController.uploadAvatar,
//     );

//     this.router.post("/kyc/identity", kycController.submitProviderKyc);
//     this.router.get("/kyc/identity", kycController.getProviderKyc);
//     this.router.post("/kyc/bank", kycController.saveProviderBank); // bacnk info saving to db after document upload
//     this.router.get("/kyc/bank", kycController.getProviderBank);
//     this.router.post("/media/kyc-document", kycController.uploadProviderKyc); // uploading url generating controller

//     this.router.post(
//       "/providerService",
//       providerServiceController.createProviderService,
//     );
//     this.router.get(
//       "/providerServices",
//       providerServiceController.getProviderServicesByCategory,
//     );
//     this.router.patch(
//       "/providerService",
//       providerServiceController.setProviderServicePrice,
//     );
//     this.router.delete(
//       "/providerService/:id",
//       providerServiceController.deleteProviderService,
//     );

//     this.router.get("/availability", availabilityController.getAvailability);
//     this.router.put("/availability", availabilityController.setAvailability);

//     // ─── Unavailability ───────────────────────────────────────────────────────
//     this.router.get(
//       "/unavailability",
//       unavaliabilityController.getUnavailabilities,
//     );
//     this.router.post(
//       "/unavailability",
//       unavaliabilityController.createUnavailability,
//     );
//     this.router.delete(
//       "/unavailability/:id",
//       unavaliabilityController.deleteUnavailability,
//     );

//     // ─── Availability Overrides ───────────────────────────────────────────────
//     this.router.get(
//       "/availability/overrides",
//       availabilityOverrideController.getAvailabilityOverrides,
//     );
//     this.router.put(
//       "/availability/overrides",
//       availabilityOverrideController.setAvailabilityOverride,
//     );
//     this.router.delete(
//       "/availability/overrides/:date",
//       availabilityOverrideController.deleteAvailabilityOverride,
//     );

//     //---Portfolio

//     this.router.get("/portfolio/upload-url", portfolioController.getUploadUrl);
//     this.router.post("/portfolio", portfolioController.createPortfolioItem);
//     this.router.get("/portfolio", portfolioController.getPortfolio);
//     this.router.delete(
//       "/portfolio/:id",
//       portfolioController.deletePortfolioItem,
//     );
//     this.router.delete(
//       "/portfolio/:id/images",
//       portfolioController.removePortfolioImage,
//     );
//     this.router.patch(
//       "/portfolio/:id",
//       portfolioController.updatePortfolioItem,
//     );

//     this.router.get(
//       "/bookings",
//       bookingController.listBookings(UserRole.PROVIDER),
//     );
//     this.router.patch(
//       "/bookings/:id/cancel",
//       bookingController.cancelBooking(UserRole.PROVIDER),
//     );
//     this.router.patch(
//       "/bookings/:id/complete",
//       bookingController.completeBooking,
//     );
//     this.router.patch(
//       "/bookings/:id/provider-complete",
//       bookingController.providerCompleteBooking,
//     );
//     this.router.get(
//       "/payouts",
//       payoutController.getPayouts,
//     );
//     this.router.post(
//       "/payout-requests",
//       payoutController.createPayoutRequest,
//     );
//     this.router.get(
//       "/payout-requests",
//       payoutController.getPayoutRequests,
//     );
//   }
// }




import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
import {
  providerProfileController,
  kycController,
  providerServiceController,
  availabilityController,
  unavaliabilityController,
  availabilityOverrideController,
  portfolioController,
  slotController,
} from "../../infrastructure/di/provider.Di";
import { adminProviderController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class ProviderRouter {
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

    // ─── CLIENT / PUBLIC DISCOVERY ───────────────────────────────
    this.router.get(
      "/:providerId/services/:serviceId/slots",
      authorizeRoles(UserRole.CLIENT),
      slotController.getAvailableSlots
    );

    // ─── ADMIN MANAGEMENT ────────────────────────────────────────
    this.router.get("/", adminOnly, adminProviderController.getAllProviders);
    this.router.get("/:id", adminOnly, adminProviderController.getProviderById);
    this.router.patch("/:id/approve", adminOnly, adminProviderController.approveProvider);
    this.router.put("/:id/reject", adminOnly, adminProviderController.rejectProvider);
    this.router.patch("/:id/block", adminOnly, adminProviderController.blockProvider);
    this.router.get("/:id/kyc", adminOnly, adminProviderController.getProviderKyc);
    this.router.get("/:id/bank", adminOnly, adminProviderController.getProviderBank);
    this.router.patch("/:id/bank/approve", adminOnly, adminProviderController.approveProviderBank);

    // ─── PROVIDER SELF-MANAGEMENT (/me) ──────────────────────────
    // Profile
    this.router.post("/me/profile", providerOnly, providerProfileController.createProviderProfile);
    this.router.get("/me/profile", providerOnly, providerProfileController.getProviderProfile);
    this.router.put("/me/profile", providerOnly, providerProfileController.updateProviderProfile);
    this.router.post("/me/profile-upload-url", providerOnly, providerProfileController.uploadAvatar);

    // KYC
    this.router.post("/me/kyc/identity", providerOnly, kycController.submitProviderKyc);
    this.router.get("/me/kyc/identity", providerOnly, kycController.getProviderKyc);
    this.router.post("/me/kyc/bank", providerOnly, kycController.saveProviderBank);
    this.router.get("/me/kyc/bank", providerOnly, kycController.getProviderBank);
    this.router.post("/me/media/kyc-document", providerOnly, kycController.uploadProviderKyc);

    // Services Offered by Provider
    this.router.post("/me/services", providerOnly, providerServiceController.createProviderService);
    this.router.get("/me/services", providerOnly, providerServiceController.getProviderServicesByCategory);
    this.router.patch("/me/services", providerOnly, providerServiceController.setProviderServicePrice);
    this.router.delete("/me/services/:id", providerOnly, providerServiceController.deleteProviderService);

    // Availability & Schedules
    this.router.get("/me/availability", providerOnly, availabilityController.getAvailability);
    this.router.put("/me/availability", providerOnly, availabilityController.setAvailability);

    this.router.get("/me/unavailability", providerOnly, unavaliabilityController.getUnavailabilities);
    this.router.post("/me/unavailability", providerOnly, unavaliabilityController.createUnavailability);
    this.router.delete("/me/unavailability/:id", providerOnly, unavaliabilityController.deleteUnavailability);

    this.router.get("/me/availability/overrides", providerOnly, availabilityOverrideController.getAvailabilityOverrides);
    this.router.put("/me/availability/overrides", providerOnly, availabilityOverrideController.setAvailabilityOverride);
    this.router.delete("/me/availability/overrides/:date", providerOnly, availabilityOverrideController.deleteAvailabilityOverride);

    // Portfolio
    this.router.get("/me/portfolio/upload-url", providerOnly, portfolioController.getUploadUrl);
    this.router.post("/me/portfolio", providerOnly, portfolioController.createPortfolioItem);
    this.router.get("/me/portfolio", providerOnly, portfolioController.getPortfolio);
    this.router.patch("/me/portfolio/:id", providerOnly, portfolioController.updatePortfolioItem);
    this.router.delete("/me/portfolio/:id", providerOnly, portfolioController.deletePortfolioItem);
    this.router.delete("/me/portfolio/:id/images", providerOnly, portfolioController.removePortfolioImage);
  }
}