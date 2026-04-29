import { ServiceMode } from "../entity.types";

export class Category {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string | null,
    public readonly mode: ServiceMode,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    name: string;
    description?: string | null;
    mode: ServiceMode;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Category {
    const now = new Date();

    return new Category(
      data.id,
      data.name,
      data.description ?? null,
      data.mode,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}