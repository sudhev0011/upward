import { MongoNotificationRepository } from '../persistence/mongodb/repositories/notification.repository';
import { socketService } from '../services/socket.service';
import { NotificationService } from '../services/notification.service';
import { GetNotificationsUseCase } from '../../application/use-cases/notification/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../../application/use-cases/notification/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../../application/use-cases/notification/mark-all-notifications-read.use-case';
import { GetUnreadNotificationsCountUseCase } from '../../application/use-cases/notification/get-unread-count.use-case';
import { DeleteNotificationUseCase } from '../../application/use-cases/notification/delete-notification.use-case';
import { NotificationController } from '../../presentation/controllers/notification.controller';

// Repositories
const notificationRepository = new MongoNotificationRepository();

// Services
export const notificationService = new NotificationService(
  notificationRepository,
  socketService
);

// Use Cases
export const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
export const markNotificationReadUseCase = new MarkNotificationReadUseCase(notificationRepository);
export const markAllNotificationsReadUseCase = new MarkAllNotificationsReadUseCase(notificationRepository);
export const getUnreadNotificationsCountUseCase = new GetUnreadNotificationsCountUseCase(notificationRepository);
export const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepository);

// Controller
export const notificationController = new NotificationController(
  getNotificationsUseCase,
  getUnreadNotificationsCountUseCase,
  markNotificationReadUseCase,
  markAllNotificationsReadUseCase,
  deleteNotificationUseCase
);
