import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  validateUserId,
  sendSuccessResponse,
  handleAsyncError,
} from "../../shared/utils/presentation/controller.utils";
import { GetNotificationsUseCase } from "../../application/use-cases/notification/get-notifications.use-case";
import { GetUnreadNotificationsCountUseCase } from "../../application/use-cases/notification/get-unread-count.use-case";
import { MarkNotificationReadUseCase } from "../../application/use-cases/notification/mark-notification-read.use-case";
import { MarkAllNotificationsReadUseCase } from "../../application/use-cases/notification/mark-all-notifications-read.use-case";
import { DeleteNotificationUseCase } from "../../application/use-cases/notification/delete-notification.use-case";
import { successResponse } from "../../shared/constants";
import { RegisterFcmTokenUseCase } from "../../application/use-cases/notification/register-fcm-token.use-case";

export class NotificationController {
  constructor(
    private readonly _getNotificationsUseCase: GetNotificationsUseCase,
    private readonly _getUnreadNotificationsCountUseCase: GetUnreadNotificationsCountUseCase,
    private readonly _markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly _markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
    private readonly _deleteNotificationUseCase: DeleteNotificationUseCase,
    private readonly _registerFcmTokenUseCase: RegisterFcmTokenUseCase,
  ) {}

  getNotifications = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const result = await this._getNotificationsUseCase.execute(
        userId,
        page,
        limit,
      );
      sendSuccessResponse(res, successResponse.GET_NOTIFICATIONS, result);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getUnreadCount = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const count =
        await this._getUnreadNotificationsCountUseCase.execute(userId);
      sendSuccessResponse(res, successResponse.GET_UNREAD_NOTIFICATION_COUNT, {
        count,
      });
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAsRead = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      validateUserId(req);
      const id = req.params.id as string;
      await this._markNotificationReadUseCase.execute(id);
      sendSuccessResponse(res, successResponse.MARK_AS_READ, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  markAllAsRead = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      await this._markAllNotificationsReadUseCase.execute(userId);
      sendSuccessResponse(res, successResponse.MARK_ALL_AS_READ, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  deleteNotification = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      validateUserId(req);
      const id = req.params.id as string;
      await this._deleteNotificationUseCase.execute(id);
      sendSuccessResponse(res, successResponse.DELETE_NOTIFICATION, null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  registerFcmToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { token, deviceType } = req.body;

      await this._registerFcmTokenUseCase.execute(userId, token, deviceType);

      sendSuccessResponse(res, "FCM Token registered successfully", null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}
