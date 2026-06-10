export interface Notification {
  id: string;
  recipientId: string;
  senderId?: string | null;
  title: string;
  message: string;
  type: 'chat' | 'booking' | 'payment' | 'wallet' | 'system';
  isRead: boolean;
  data?: Record<string, any> | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedNotifications {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
