import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { walletController } from "../../infrastructure/di/clientDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class WalletRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    // Client/User wallet retrieval
    this.router.get("/me", authorizeRoles(UserRole.CLIENT), walletController.getWallet);
  }
}