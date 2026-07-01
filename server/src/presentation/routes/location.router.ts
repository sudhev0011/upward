import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { LocationController } from '../controllers/location/location.controller';

export class LocationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get('/search', LocationController.search);
    this.router.get('/details', LocationController.details);
  }
}
