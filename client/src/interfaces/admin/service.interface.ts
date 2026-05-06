export interface CreateServiceRequest {
  categoryId: string;
  name: string;
  description: string;
  maxHour: number | null;
  mode: "onsite" | "offsite" | "both";
  isActive: boolean;
}

export interface UpdateServiceRequest{
  id: string;
  categoryId: string;
  name?: string;
  description?: string;
  maxHour?: number | null;
  mode?: "onsite" | "offsite" | "both";
  isActive?: boolean;
}

export interface ServiceResponse {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  mode: "onsite" | "offsite" | "both";
  maxHour: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedServicesResponse{
  data: ServiceResponse[],
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
