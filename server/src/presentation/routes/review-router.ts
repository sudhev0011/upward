import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { reviewController } from '../../infrastructure/di/reviewDi';

export class ReviewRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    // Public route to view provider reviews (e.g. on profile page)
    this.router.get('/provider/:providerId', reviewController.getProviderReviews);

    // Authenticated routes
    this.router.post('/', authenticateToken, reviewController.createReview);
    this.router.get('/client', authenticateToken, reviewController.getClientReviews);
    this.router.get('/pending', authenticateToken, reviewController.getPendingReviews);
  }
}
