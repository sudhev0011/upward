export class Notification {
  constructor(
    public readonly id: string | undefined,
    public readonly recipientId: string,
    public readonly senderId: string | null,
    public readonly title: string,
    public readonly message: string,
    public readonly type: 'chat' | 'booking' | 'payment' | 'wallet' | 'system',
    public readonly isRead: boolean,
    public readonly data: Record<string, any> | null,
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id?: string;
    recipientId: string;
    senderId?: string | null;
    title: string;
    message: string;
    type: 'chat' | 'booking' | 'payment' | 'wallet' | 'system';
    isRead?: boolean;
    data?: Record<string, any> | null;
    createdAt?: Date;
  }): Notification {
    const now = new Date();
    return new Notification(
      data.id,
      data.recipientId,
      data.senderId ?? null,
      data.title,
      data.message,
      data.type,
      data.isRead ?? false,
      data.data ?? null,
      data.createdAt ?? now
    );
  }
}
