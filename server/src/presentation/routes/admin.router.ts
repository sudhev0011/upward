import { Router } from "express";
import {
  authenticateToken,
  authorizeRoles
} from "../middleware/auth.middleware";
import { adminProviderController, adminClientController, adminCategoryController, adminServiceController, adminDashboardController, adminPaymentController, adminPayoutController } from "../../infrastructure/di/adminDi";

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    this.router.use(authorizeRoles("admin"))
    
    this.router.get("/dashboard/stats", adminDashboardController.getStats);
    this.router.get("/payments", adminPaymentController.getPayments);
    this.router.get("/payout-requests", adminPayoutController.getPayoutRequests);
    this.router.put("/payout-requests/:id", adminPayoutController.processPayoutRequest);

    this.router.get("/clients", adminClientController.getAllClients);
    this.router.patch("/client/block", adminClientController.blockClient);
    this.router.get("/client/:id", adminClientController.getClientById);

    this.router.get("/providers",adminProviderController.getAllProviders);
    this.router.get("/provider/:id",adminProviderController.getProviderById);
    this.router.patch("/provider/approve",adminProviderController.approveProvider);
    this.router.put("/provider/reject",adminProviderController.rejectProvider);
    this.router.patch("/provider/block",adminProviderController.blockProvider);
    this.router.get('/kyc/identity/:userId', adminProviderController.getProviderKyc);
    this.router.get("/provider/:id/bank", adminProviderController.getProviderBank);
    this.router.patch("/provider/:id/bank/approve", adminProviderController.approveProviderBank);

    this.router.post("/category", adminCategoryController.createCategory);
    this.router.get("/categories/all", adminCategoryController.getAllCategories);
    this.router.get("/categories", adminCategoryController.getAllPaginatedCategories);
    this.router.patch("/category/update", adminCategoryController.updateCategory);

    
    
    this.router.post("/service", adminServiceController.createService);
    this.router.delete("/service/:serviceId", adminServiceController.deleteService);
    this.router.get("/services/all", adminServiceController.getAllService)
    this.router.get("/services", adminServiceController.getAllServicesWithPagination);
    this.router.patch("/service/toggle", adminServiceController.toggleService);
    this.router.patch("/service/update", adminServiceController.updateService);

    
  }
}
