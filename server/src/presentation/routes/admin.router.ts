import { Router } from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { adminProviderController, adminClientController } from "../../infrastructure/di/adminDi";

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    // this.router.use(authorizeRoles('provider'));

    this.router.get("/clients", adminClientController.getAllClients);
    this.router.patch("/client/block", adminClientController.blockClient);
    this.router.get("/client/:id", adminClientController.getClientById);

    this.router.get("/providers",adminProviderController.getAllProviders);
    this.router.get("/provider/:id",adminProviderController.getProviderById);
    this.router.patch("/provider/approve",adminProviderController.approveProvider);
    this.router.put("/provider/reject",adminProviderController.rejectProvider);
    this.router.patch("/provider/block",adminProviderController.blockProvider);
    this.router.get('/kyc/identity/:userId', adminProviderController.getProviderKyc);
  }
}
