import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { PaginatedNotifications } from '@/interfaces/notification.interface';
import { NotificationRoutes } from '@/constants/api-routes';

export const notificationApi = {
  async getNotifications(page: number = 1, limit: number = 20): Promise<ApiEnvelope<PaginatedNotifications>> {
    return (
      await api.get<ApiEnvelope<PaginatedNotifications>>(NotificationRoutes.GET_NOTIFICATIONS, {
        params: { page, limit },
      })
    ).data;
  },

  async getUnreadCount(): Promise<ApiEnvelope<{ count: number }>> {
    return (
      await api.get<ApiEnvelope<{ count: number }>>(NotificationRoutes.UNREAD_COUNT)
    ).data;
  },

  async markAsRead(id: string): Promise<ApiEnvelope<null>> {
    return (
      await api.patch<ApiEnvelope<null>>(NotificationRoutes.MARK_READ.replace(':id', id))
    ).data;
  },

  async markAllAsRead(): Promise<ApiEnvelope<null>> {
    return (
      await api.patch<ApiEnvelope<null>>(NotificationRoutes.MARK_ALL_READ)
    ).data;
  },

  async deleteNotification(id: string): Promise<ApiEnvelope<null>> {
    return (
      await api.delete<ApiEnvelope<null>>(NotificationRoutes.DELETE_NOTIFICATION.replace(':id', id))
    ).data;
  },
};
