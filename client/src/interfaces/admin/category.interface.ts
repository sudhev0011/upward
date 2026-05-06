export interface CreateCategoryRequest {
  name: string;
  description: string;
  mode: "onsite" | "offsite" | "both";
  isActive: boolean;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
  mode?: "onsite" | "offsite" | "both";
  isActive?: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  mode: "onsite" | "offsite" | "both";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCategoryResponse {
  data: CategoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
