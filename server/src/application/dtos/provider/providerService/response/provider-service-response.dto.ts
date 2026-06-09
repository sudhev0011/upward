export interface ProviderServiceResponseDto {
  id: string;
  providerId: string;
  serviceId: string;
  price: number | null;
  dailyCapacity: number | null;
  status: "draft" | "active" | "inactive";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
