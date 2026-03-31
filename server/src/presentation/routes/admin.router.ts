import { Router } from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware";
import { adminUserController } from "../../infrastructure/di/adminDi";

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);
    // this.router.use(authorizeRoles('provider'));

    this.router.get("/users", adminUserController.getAllUsers);
    this.router.patch("/users/block", adminUserController.blockUser);
    this.router.get("/users/:id", adminUserController.getUserById);
  }
}
