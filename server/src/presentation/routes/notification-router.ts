import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { notificationController } from '../../infrastructure/di/notificationDi';

export class NotificationRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get('/', notificationController.getNotifications);
    this.router.get('/unread-count', notificationController.getUnreadCount);
    this.router.patch('/read-all', notificationController.markAllAsRead);
    this.router.patch('/:id/read', notificationController.markAsRead);
    this.router.delete('/:id', notificationController.deleteNotification);
  }
}
