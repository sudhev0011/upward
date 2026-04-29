import { ProviderServiceStatus } from "../enums/provider-service.status.enum";

export class ProviderService {
  constructor(
    public readonly id: string | undefined,
    public readonly providerId: string,
    public readonly serviceId: string,
    public readonly price: number | null,
    public readonly status: ProviderServiceStatus,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    providerId: string;
    serviceId: string;
    price?: number | null;
    status?: ProviderServiceStatus;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): ProviderService {
    const now = new Date();

    return new ProviderService(
      data.id,
      data.providerId,
      data.serviceId,
      data.price ?? null,
      data.status ?? ProviderServiceStatus.DRAFT,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }

  setPrice(price: number): ProviderService {
    if (price <= 0) {
      throw new Error("Price must be greater than zero");
    }

    return new ProviderService(
      this.id,
      this.providerId,
      this.serviceId,
      price,
      ProviderServiceStatus.ACTIVE,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }
}