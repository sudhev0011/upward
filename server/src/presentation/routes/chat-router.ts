import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { chatController } from '../../infrastructure/di/chatDi';

export class ChatRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this._initializeRoutes();
  }

  private _initializeRoutes(): void {
    this.router.use(authenticateToken);

    this.router.get('/conversations', chatController.getConversations);
    this.router.get('/presigned-url', chatController.getPresignedUrl);
    this.router.get('/messages/:conversationId', chatController.getMessages);
    this.router.post('/conversations', chatController.findOrCreateConversation);
    this.router.patch('/conversations/:conversationId/reset', chatController.resetUnreadCount);
  }
}
