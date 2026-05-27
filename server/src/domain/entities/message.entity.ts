export class Message {
  constructor(
    public readonly id: string | undefined,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly text: string,
    public readonly attachmentUrl: string | null,
    public readonly isRead: boolean,
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id?: string;
    conversationId: string;
    senderId: string;
    text: string;
    attachmentUrl?: string | null;
    isRead?: boolean;
    createdAt?: Date;
  }): Message {
    const now = new Date();
    return new Message(
      data.id,
      data.conversationId,
      data.senderId,
      data.text,
      data.attachmentUrl ?? null,
      data.isRead ?? false,
      data.createdAt ?? now
    );
  }
}
