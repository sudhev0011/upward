import { ServiceMode } from "../entity.types";

export class Service {
  constructor(
    public readonly id: string | undefined,
    public readonly categoryId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly maxHour: number | null,
    public readonly mode: ServiceMode, 
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    categoryId: string;
    name: string;
    description?: string | null;
    maxHour: number | null;
    mode: ServiceMode;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Service {
    const now = new Date();

    return new Service(
      data.id,
      data.categoryId,
      data.name,
      data.description ?? null,
      data.maxHour ?? null,
      data.mode,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}