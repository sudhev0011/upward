export interface UserMessageState {
  isRead: boolean;
  isDeleted: boolean;
}

export class Message {
  constructor(
    public readonly id: string | undefined,
    public readonly conversationId: string,
    public readonly senderId: string,
    public readonly text: string,
    public readonly attachmentUrl: string | null,
    public readonly isDelivered: boolean,
    public readonly userStates: Record<string, UserMessageState>,
    public readonly reactions: Record<string, string>, 
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id?: string;
    conversationId: string;
    senderId: string;
    text: string;
    attachmentUrl?: string | null;
    isDelivered?: boolean;
    userStates: Record<string, UserMessageState>;
    reactions?: Record<string, string>;
    createdAt?: Date;
  }): Message {
    const now = new Date();
    return new Message(
      data.id,
      data.conversationId,
      data.senderId,
      data.text,
      data.attachmentUrl ?? null,
      data.isDelivered ?? false,
      data.userStates,
      data.reactions ?? {},
      data.createdAt ?? now
    );
  }
}