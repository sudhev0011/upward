import { Router } from "express";
import {
  publicAvailabilityController,
  publicCategoryController,
  publicPortfolioController,
  publicProviderProfileController,
  publicProviderServiceController,
  publicServiceController,
} from "../../infrastructure/di/publicDi";
import {
  providerProfileController,
  slotController,
} from "../../infrastructure/di/provider.Di";

export class PublicRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.get("/categories", publicCategoryController.getAllCategories);
    this.router.get("/services", publicServiceController.getAllService);
    this.router.get(
      "/services/:categoryId",
      publicServiceController.getServicesByCategory,
    );
    this.router.get(
      "/providers",
      providerProfileController.getProvidersByCategory,
    );
    this.router.get(
      "/providers/:providerId/portfolio",
      publicPortfolioController.getPortfolio,
    );
    this.router.get(
      "/providers/:providerId/availability",
      publicAvailabilityController.getAvailability,
    );
    this.router.get(
      "/providers/:providerId/availability/overrides",
      publicAvailabilityController.getAvailabilityOverrides,
    );
    this.router.get(
      "/providers/:providerId/unavailability",
      publicAvailabilityController.getUnavailabilities,
    );

    this.router.get(
      "/providers/:providerId/profile",
      publicProviderProfileController.getProviderProfile,
    );

    this.router.get(
      "/providers/:providerId/services",
      publicProviderServiceController.getActiveServices,
    );

    this.router.get(
      "/providers/:providerId/services/:serviceId/slots",
      slotController.getAvailableSlots,
    );
  }
}
