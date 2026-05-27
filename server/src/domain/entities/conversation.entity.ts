export class Conversation {
  constructor(
    public readonly id: string | undefined,
    public readonly clientId: string,
    public readonly providerId: string,
    public readonly lastMessageId: string | null,
    public readonly unreadCountClient: number,
    public readonly unreadCountProvider: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    clientId: string;
    providerId: string;
    lastMessageId?: string | null;
    unreadCountClient?: number;
    unreadCountProvider?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }): Conversation {
    const now = new Date();
    return new Conversation(
      data.id,
      data.clientId,
      data.providerId,
      data.lastMessageId ?? null,
      data.unreadCountClient ?? 0,
      data.unreadCountProvider ?? 0,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}
