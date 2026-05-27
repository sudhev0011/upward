import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  validateUserId,
  sendSuccessResponse,
  handleAsyncError,
} from '../../shared/utils/presentation/controller.utils';
import { IGetConversationsUseCase } from '../../domain/interfaces/usecases/chat/IGetConversationsUseCase';
import { IGetMessagesUseCase } from '../../domain/interfaces/usecases/chat/IGetMessagesUseCase';
import { IFindOrCreateConversationUseCase } from '../../domain/interfaces/usecases/chat/IFindOrCreateConversationUseCase';
import { IResetUnreadCountUseCase } from '../../domain/interfaces/usecases/chat/IResetUnreadCountUseCase';

export class ChatController {
  constructor(
    private readonly _getConversationsUseCase: IGetConversationsUseCase,
    private readonly _getMessagesUseCase: IGetMessagesUseCase,
    private readonly _findOrCreateConversationUseCase: IFindOrCreateConversationUseCase,
    private readonly _resetUnreadCountUseCase: IResetUnreadCountUseCase
  ) {}

  getConversations = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const result = await this._getConversationsUseCase.execute(userId);
      sendSuccessResponse(res, 'Conversations retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getMessages = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      validateUserId(req); // ensure user is authenticated
      const conversationId = req.params.conversationId as string;
      const limit = Number(req.query.limit ?? 50);
      const skip = Number(req.query.skip ?? 0);

      const result = await this._getMessagesUseCase.execute(conversationId, limit, skip);
      sendSuccessResponse(res, 'Messages retrieved successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  findOrCreateConversation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const clientId = validateUserId(req);
      const { providerId } = req.body;
      if (!providerId) {
        res.status(400).json({ success: false, message: 'providerId is required' });
        return;
      }

      const result = await this._findOrCreateConversationUseCase.execute(clientId, providerId);
      sendSuccessResponse(res, 'Conversation found or created successfully', result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  resetUnreadCount = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      validateUserId(req);
      const conversationId = req.params.conversationId as string;
      const { role } = req.body;

      if (role !== 'client' && role !== 'provider') {
        res.status(400).json({ success: false, message: 'Invalid or missing role parameter' });
        return;
      }

      await this._resetUnreadCountUseCase.execute(conversationId, role);
      sendSuccessResponse(res, 'Unread count reset successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
