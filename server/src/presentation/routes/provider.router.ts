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
} from "../../infrastructure/di/provider.Di";
import { UserBlockedMiddleware } from "../middleware/user-blocked.middleware";
import { getUserByIdUseCase } from "../../infrastructure/di/authDi";
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
  }
}
