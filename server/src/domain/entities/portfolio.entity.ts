export class PortfolioItem {
  constructor(
    public readonly id: string | undefined,
    public readonly providerId: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly images: string[],
    public readonly storageKeys: string[],
    public readonly thumbnailUrl: string | null,
    public readonly tags: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    providerId: string;
    title: string;
    description?: string | null;
    images: string[];
    storageKeys: string[];
    thumbnailUrl?: string | null;
    tags?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }): PortfolioItem {
    const now = new Date();

    return new PortfolioItem(
      data.id,
      data.providerId,
      data.title,
      data.description ?? null,
      data.images,
      data.storageKeys,
      data.thumbnailUrl ?? null,
      data.tags ?? [],
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}