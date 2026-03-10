export class ClientProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly phone: string | null,
    public readonly location: string | null,
    public readonly profilePicture: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    userId: string;
    phone?: string;
    location?: string;
    profilePicture?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): ClientProfile {
    const now = new Date();
    return new ClientProfile(
      data.id,
      data.userId,
      data.phone ?? null,
      data.location ?? null,
      data.profilePicture ?? null,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
