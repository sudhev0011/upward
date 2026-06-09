export class ClientProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly phone: string | null,
    public readonly location: string | null,
    public readonly avatarUrl: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    userId: string;
    phone?: string;
    location?: string;
    avatarUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): ClientProfile {
    const now = new Date();
    return new ClientProfile(
      data.id,
      data.userId,
      data.phone ?? null,
      data.location ?? null,
      data.avatarUrl ?? null,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
