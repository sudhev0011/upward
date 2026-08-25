import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.middleware";
import { adminCategoryController } from "../../infrastructure/di/adminDi";
import { UserRole } from "../../domain/enums/user-role.enum";

export class CategoryRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    // ─── READ (Accessible to Authenticated Users) ────────────────
    this.router.get("/", adminCategoryController.getAllPaginatedCategories);
    this.router.get("/all", adminCategoryController.getAllCategories);

    // ─── ADMIN MANAGEMENT ────────────────────────────────────────
    this.router.post("/", authorizeRoles(UserRole.ADMIN), adminCategoryController.createCategory);
    this.router.patch("/:id", authorizeRoles(UserRole.ADMIN), adminCategoryController.updateCategory);
  }
}