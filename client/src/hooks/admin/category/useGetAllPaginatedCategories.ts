import { adminApi } from "@/api/admin.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePaginatedCategories = (params: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  mode?: "onsite" | "offsite" | "both";
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["categoriesAdmin", "list",params],
    queryFn: () => adminApi.getAllPaginatedCategories(params),
    placeholderData: keepPreviousData,
  });
};